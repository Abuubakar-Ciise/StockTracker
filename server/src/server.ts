import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import analyticsRoutes from './routes/analytics.route';

import { auth} from './lib/auth'

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());          
app.use(express.json());  

// Better Auth API routes - MUST be before other routes
app.use("/api/auth", auth.handler);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);


// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
