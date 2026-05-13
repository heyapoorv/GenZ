const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  sizeStock: [{
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 }
  }],
  totalStock: {
    type: Number,
    default: 0
  },
  images: [{ type: String, required: true }],
  description: { type: String, required: true }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  this.totalStock = this.sizeStock.reduce((acc, item) => acc + item.stock, 0);
  next();
});

// Add Indexes for performance and NoSQL injection resistance
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
