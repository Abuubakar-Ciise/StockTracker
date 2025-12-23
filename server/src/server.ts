import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.route';
import productRoutes from './routes/product.route';
import analyticsRoutes from './routes/analytics.route';

import { auth} from './lib/auth'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());          
app.use(express.json());  

// Better Auth API routes - MUST be before other routes
app.use("/api/auth", auth.handler);
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve static files from the React app in production
const isProduction = process.env.NODE_ENV === 'production';
const frontendDistPath = path.join(__dirname, '../../dashboard/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');

// Serve static assets (JS, CSS, images, etc.) only in production
if (isProduction) {
  app.use(express.static(frontendDistPath));

  // Catch all handler: send back React's index.html file for client-side routing
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(frontendIndexPath);
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
