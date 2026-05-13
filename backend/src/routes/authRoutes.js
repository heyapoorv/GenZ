const express = require('express');
const router = express.Router();
const { register, login, logout, refreshToken } = require('../controllers/authController');
const { body } = require('express-validator');
const validate = require('../middlewares/validateMiddleware');

router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    validate
  ],
  register
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
    validate
  ],
  login
);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

module.exports = router;
