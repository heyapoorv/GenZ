const express = require('express');
const router = express.Router();
const { 
  getWishlist, 
  toggleWishlist,
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/wishlist')
  .get(protect, getWishlist);

router.route('/wishlist/:id')
  .post(protect, toggleWishlist);

module.exports = router;
