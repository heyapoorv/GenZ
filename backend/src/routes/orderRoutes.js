const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  createRazorpayOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/debug-check', (req, res) => res.json({ message: 'Order router is mounted and active' }));
router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.get('/admin', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

router.get('/', protect, getMyOrders);
router.post('/', protect, addOrderItems);

module.exports = router;
