const Cart = require('../models/Cart');

// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product', 'name price images stock');
    if (!cart) {
      return res.json({ products: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/cart
exports.syncCart = async (req, res, next) => {
  try {
    const { products } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.products = products;
      await cart.save();
    } else {
      cart = await Cart.create({
        userId: req.user._id,
        products
      });
    }

    const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.product', 'name price images stock');
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};
