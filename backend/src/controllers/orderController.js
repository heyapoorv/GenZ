const Order = require('../models/Order');
const User = require('../models/User');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'hello@zenitharcade.com',
    pass: process.env.EMAIL_PASS || 'dummy_password'
  }
});

// @route   POST /api/orders/create-razorpay-order
exports.createRazorpayOrder = async (req, res, next) => {
  console.log('--- Incoming Razorpay Order Request ---');
  try {
    const { products, address } = req.body;
    const Product = require('../models/Product');
    
    // Optimized: Fetch all products in one query
    const productIds = products.map(p => 
      (typeof p.product === 'object' && p.product !== null) ? p.product._id : p.product
    );
    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();
    
    let totalAmount = 0;
    for (const item of products) {
      const currentId = (typeof item.product === 'object' && item.product !== null) ? item.product._id : item.product;
      const dbProduct = dbProducts.find(p => p._id.toString() === currentId.toString());
      
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${currentId} not found` });
      }

      // Check stock for specific size
      const sizeInfo = dbProduct.sizeStock.find(s => s.size === item.size);
      if (!sizeInfo || sizeInfo.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${dbProduct.name} in size ${item.size}` });
      }

      totalAmount += dbProduct.price * item.quantity;
    }
    
    const taxRate = Number(process.env.TAX_RATE) || 0.18;
    totalAmount = totalAmount * (1 + taxRate); 

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id ? req.user._id.toString() : 'guest',
        address: JSON.stringify(address),
        products: JSON.stringify(products.map(p => ({
          product: p.product,
          quantity: p.quantity,
          size: p.size,
          price: p.price 
        })))
      }
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    console.error('CRITICAL ERROR IN createRazorpayOrder:', error);
    next(error);
  }
};

// @route   POST /api/orders
exports.addOrderItems = async (req, res, next) => {
  try {
    const { 
      products, 
      address, 
      totalAmount, 
      paymentId, 
      orderId, 
      signature 
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Verify Razorpay signature
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest('hex');
    
    if (generated_signature !== signature && process.env.NODE_ENV === 'production') {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const orderProducts = products.map(p => ({
      product: (typeof p.product === 'object' && p.product !== null) ? p.product._id : p.product,
      quantity: p.quantity,
      size: p.size,
      price: p.price
    }));

    const order = new Order({
      userId: req.user._id,
      products: orderProducts,
      address,
      totalAmount,
      paymentStatus: 'paid',
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature
    });

    const createdOrder = await order.save();

    // Update stock
    const Product = require('../models/Product');
    for (const item of products) {
      const productId = (typeof item.product === 'object' && item.product !== null) ? item.product._id : item.product;
      await Product.findOneAndUpdate(
        { _id: productId, 'sizeStock.size': item.size },
        { $inc: { 'sizeStock.$.stock': -item.quantity } }
      );
      const p = await Product.findById(productId);
      if (p) await p.save();
    }

    // Send confirmation email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: `Order Confirmation - Zenith Arcade`,
        text: `Your order #${createdOrder._id} has been placed successfully. Amount: ₹${totalAmount}`
      };
      transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error('Email failed', emailErr);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const [count, orders] = await Promise.all([
      Order.countDocuments({ userId: req.user._id }),
      Order.find({ userId: req.user._id })
        .populate('products.product', 'name images')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .lean()
    ]);

    res.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/orders
exports.getOrders = async (req, res, next) => {
  try {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;

    const [count, orders] = await Promise.all([
      Order.countDocuments({}),
      Order.find({})
        .populate('userId', 'id name')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .lean()
    ]);

    res.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};
