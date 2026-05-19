const express = require('express');
const Stripe = require('stripe');
const Order = require('../models/Order');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'hello@zenitharcade.com',
    pass: process.env.EMAIL_PASS || 'dummy_password'
  }
});

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) throw new Error('STRIPE_WEBHOOK_SECRET is missing');
    
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Verification Failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const metadata = paymentIntent.metadata;

    // Start a session for Atomicity (Transaction)
    const mongoose = require('mongoose');
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Idempotency Check
      const existingOrder = await Order.findOne({ paymentId: paymentIntent.id }).session(session);
      if (existingOrder) {
        await session.abortTransaction();
        session.endSession();
        return res.send({ received: true, message: 'Order already processed' });
      }

      const products = JSON.parse(metadata.products);
      const address = JSON.parse(metadata.address);

      // 2. Create Order
      const order = new Order({
        userId: metadata.userId,
        products: products,
        address: address,
        totalAmount: paymentIntent.amount / 100,
        paymentId: paymentIntent.id,
        paymentStatus: 'paid'
      });

      const createdOrder = await order.save({ session });

      // 3. Decrement Stock
      const Product = require('../models/Product');
      for (const item of products) {
        const product = await Product.findById(item.product).session(session);
        if (product) {
          const sizeIndex = product.sizeStock.findIndex(s => s.size === item.size);
          if (sizeIndex !== -1) {
            product.sizeStock[sizeIndex].stock -= item.quantity;
            if (product.sizeStock[sizeIndex].stock < 0) throw new Error(`Product ${product.name} out of stock for size ${item.size}`);
            product.totalStock -= item.quantity;
            await product.save({ session });
          }
        }
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // 4. Send Confirmation Email (Non-critical, outside transaction)
      const user = await User.findById(metadata.userId);
      if (user?.email) {
        const mailOptions = {
          from: `"Zenith Clothing" <${process.env.EMAIL_USER || 'hello@zenitharcade.com'}>`,
          to: user.email,
          subject: `Order Confirmed - #${createdOrder._id.toString().substring(0,8)}`,
          html: `<div style="background:#111;color:#eee;padding:20px;border-radius:8px;">
                  <h1 style="color:#b6c4ff">ZENITH CLOTHING</h1>
                  <h2>Order Confirmed!</h2>
                  <p>Hi ${user.name}, your payment of $${(paymentIntent.amount/100).toFixed(2)} was successful.</p>
                  <p>Order ID: <b>${createdOrder._id}</b></p>
                 </div>`
        };
        transporter.sendMail(mailOptions).catch(e => console.error('Email Error:', e));
      }

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Webhook Order Creation Error:', error);
      return res.status(500).send('Internal Server Error during order processing');
    }
  }
  res.send({ received: true });
});

// --- RAZORPAY WEBHOOK ---
router.post('/razorpay', express.json(), async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  // 1. Signature Verification
  const crypto = require('crypto');
  const shasum = crypto.createHmac('sha256', secret || 'dummy_secret');
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== signature && process.env.NODE_ENV === 'production') {
    console.error('Razorpay Webhook Signature Verification Failed');
    return res.status(400).send('Invalid signature');
  }

  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`Razorpay Webhook Received: ${event}`);

  if (event === 'order.paid' || event === 'payment.captured') {
    const payment = payload.payment.entity;
    const orderDetails = payload.order ? payload.order.entity : null;
    
    try {
      // Idempotency check: Have we already processed this payment?
      const existingOrder = await Order.findOne({ razorpayPaymentId: payment.id });
      if (existingOrder) {
        return res.json({ status: 'ok', message: 'Order already exists' });
      }

      // If the order was created via frontend already, it will be found by razorpayOrderId
      const orderId = payment.order_id;
      let order = await Order.findOne({ razorpayOrderId: orderId });

      if (order) {
        // Update existing order if it was marked as pending
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = payment.id;
        order.razorpaySignature = signature;
        await order.save();
      } else {
        // Fallback: Create order from webhook metadata if not found (requires notes)
        const notes = orderDetails ? orderDetails.notes : payment.notes;
        if (notes && notes.userId) {
          order = new Order({
            userId: notes.userId,
            products: JSON.parse(notes.products),
            address: JSON.parse(notes.address),
            totalAmount: payment.amount / 100,
            paymentStatus: 'paid',
            razorpayOrderId: orderId,
            razorpayPaymentId: payment.id,
            razorpaySignature: signature
          });
          await order.save();
          
          // Stock management
          const Product = require('../models/Product');
          for (const item of order.products) {
            await Product.findOneAndUpdate(
              { _id: item.product, 'sizeStock.size': item.size },
              { $inc: { 'sizeStock.$.stock': -item.quantity, 'totalStock': -item.quantity } }
            );
          }
        }
      }
      
      console.log(`Order fulfilled via Webhook: ${orderId}`);
    } catch (err) {
      console.error('Webhook processing error:', err);
      return res.status(500).send('Webhook processing failed');
    }
  }

  res.json({ status: 'ok' });
});

module.exports = router;
