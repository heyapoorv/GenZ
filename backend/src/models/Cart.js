const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    size: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
