// server.js

import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRouter.js';
import sellerRouter from './routes/sellerRoutes.js';
import connectCloudniary from './configs/cloudinary.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Use an async function to start the server
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudniary();

    // Allow multiple origins
    const allowedOrigins = ['http://localhost:5173'];

    // Middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({
        origin: allowedOrigins,
        credentials: true, // ✅ corrected 'Credentials' to 'credentials'
      })
    );

    // Routes
    app.get('/', (req, res) => res.send('API is working'));
    app.use('/api/user', userRouter);
    app.use('/api/seller', sellerRouter);
    app.use('/api/product', productRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/order', orderRouter);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
};

startServer(); // Start the server
