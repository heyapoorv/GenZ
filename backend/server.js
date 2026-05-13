require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middlewares/errorMiddleware');
const logger = require('./src/utils/logger');

// Route files
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const userRoutes = require('./src/routes/userRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');

const app = express();

// Connect to Database
connectDB();

// Load Handling: Prepare for horizontal scaling
// Trust first proxy (e.g. Nginx, Cloudflare) for accurate rate limiting by IP
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com", "https://api.razorpay.com", "https://checkout-static-next.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://checkout-static-next.razorpay.com"],
      imgSrc: ["'self'", "data:", "https:", "https://via.placeholder.com", "https://lh3.googleusercontent.com", "https://cdn.razorpay.com"],
      connectSrc: ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com", "https://checkout-static-next.razorpay.com"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      workerSrc: ["'self'", "blob:", "https://checkout-static-next.razorpay.com"],
      childSrc: ["'self'", "https://checkout.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate Limiting: Prevent Brute Force and DoS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  }
});
app.use('/api', globalLimiter);

// Strict Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Even stricter: 5 attempts per hour
  message: { message: 'Too many login attempts. Please try again in an hour.' },
  handler: (req, res, next, options) => {
    logger.error(`Brute force attempt detected on login from IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Correlation ID for distributed logging
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || require('crypto').randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Performance & Scalability: Stateless Logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      logger.info(message.trim(), { service: 'http-log' });
    }
  }
}));

// Body parser
// STRIPE WEBHOOK MUST COME BEFORE EXPRESS.JSON()
app.use('/api/webhook', webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
console.log('Mounting Order Routes at /api/orders...');
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  // Root route for development
  app.get('/', (req, res) => {
    res.send('Zenith Arcade API is running...');
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
