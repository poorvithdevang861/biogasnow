import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initStore } from './models/store.js';

// Route imports
import healthRouter from './routes/health.js';
import profileRouter from './routes/profiles.js';
import wasteRouter from './routes/waste.js';
import plantRouter from './routes/plants.js';
import evidenceRouter from './routes/evidence.js';
import assumptionRouter from './routes/assumptions.js';
import enquiryRouter from './routes/enquiries.js';

dotenv.config();

// Initialize data store from seeds / store.json
initStore();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Profile context extraction
app.use((req, res, next) => {
  const profileId = req.headers['x-demo-profile'];
  if (profileId) {
    req.profileId = profileId;
  }
  next();
});

// Mount Routes
app.use('/api/health', healthRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/waste', wasteRouter);
app.use('/api/plants', plantRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/assumptions', assumptionRouter);
app.use('/api/enquiries', enquiryRouter);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Biogas Trust & Adoption Platform Backend',
    documentation: '/api/health',
    endpoints: [
      '/api/health',
      '/api/profiles',
      '/api/waste',
      '/api/plants',
      '/api/evidence',
      '/api/assumptions',
      '/api/enquiries',
    ],
    status: 'operational',
    dataModel: 'JSON store with persistent store.json',
  });
});

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: 'error',
  });
});

// Start listener
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Biogas Platform Server] Running on http://127.0.0.1:${PORT}`);
  console.log(`[Biogas Platform Server] Health check: http://127.0.0.1:${PORT}/api/health`);
});

export default app;
