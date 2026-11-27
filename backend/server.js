import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://stylehub-dress.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection error in request:', err);
  }
  next();
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'STYLEHUB Fashion E-Commerce Backend is Online!',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      auth: '/api/auth'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    service: 'STYLEHUB Fashion E-Commerce Backend',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-db', (req, res) => {
  const hasMongoUri = Boolean(process.env.MONGO_URI);
  const isAtlas = process.env.MONGO_URI ? process.env.MONGO_URI.includes('mongodb+srv') : false;
  const readyState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  res.json({
    hasMongoUri,
    isAtlas,
    dbStatus: states[readyState] || 'Unknown',
    readyState
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`STYLEHUB Backend server running on port ${PORT}`);
    console.log(`API endpoints accessible at http://localhost:${PORT}/api/`);
  });
}

export default app;
