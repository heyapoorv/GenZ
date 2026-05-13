const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const generateTokens = async (res, user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'refresh_super_secret', {
    expiresIn: '7d'
  });

  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('jwt', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  res.cookie('jwt_refresh', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      await generateTokens(res, user);
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
        // JWT is now exclusively in httpOnly cookies
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      await generateTokens(res, user);
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
        // JWT is now exclusively in httpOnly cookies
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.jwt_refresh;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_super_secret');
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(403).json({ message: 'Refresh token expired or invalid' });
  }
};

// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.cookie('jwt_refresh', '', { httpOnly: true, expires: new Date(0) });

  try {
    if (req.cookies.jwt_refresh) {
      const decoded = jwt.verify(req.cookies.jwt_refresh, process.env.JWT_REFRESH_SECRET || 'refresh_super_secret');
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = '';
        await user.save();
      }
    }
  } catch(e) {}

  res.status(200).json({ message: 'Logged out successfully' });
};
