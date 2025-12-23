import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import analyticsRoutes from './routes/analytics.route';

import { auth} from './lib/auth'
import { PORT, NODE_ENV } from './config/environment';

const app = express();
const port = PORT;

// CORS configuration
const getCorsOrigin = () => {
  if (process.env.CORS_ORIGIN) {
    // Support comma-separated origins for multiple environments
    const origins = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
    return origins.length === 1 ? origins[0] : origins;
  }
  // In development, allow all origins; in production, default to no CORS (must be set explicitly)
  return NODE_ENV === 'production' ? false : '*';
};

const corsOptions = {
  origin: getCorsOrigin(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));          
app.use(express.json());  

// Better Auth API routes - MUST be before other routes
app.use("/api/auth", auth.handler);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${NODE_ENV} mode`);
});
