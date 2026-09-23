import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './server/config/db';
import authRoutes from './server/routes/authRoutes';
import productRoutes from './server/routes/productRoutes';
import orderRoutes from './server/routes/orderRoutes';
import adminRoutes from './server/routes/adminRoutes';
import recommendationRoutes from './server/routes/recommendationRoutes';
import { getCategories } from './server/controllers/adminController';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Serve static assets
app.use('/src/assets', express.static(path.resolve(process.cwd(), 'src/assets')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.get('/api/categories', getCategories);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'REROK Shield API',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  // Initialize Database (MongoDB with automatic embedded fallback)
  await db.init();

  if (process.env.NODE_ENV === 'production') {
    // In production, serve built client assets from /dist
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // In development, hook up Vite in middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[REROK Shield] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start REROK Shield server:', err);
});
