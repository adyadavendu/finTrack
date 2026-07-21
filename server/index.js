const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Route files
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const debtRoutes = require('./routes/debts');
const reminderRoutes = require('./routes/reminders');
const summaryRoutes = require('./routes/summary');

// Initialize app
const app = express();

// ─── Security & Middleware ───────────────────────────────────────────────────
// Set security headers
app.use(helmet());

// Enable CORS
const corsOptions = {
  origin: 'https://fin-track-woad-three.vercel.app',
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser with 10mb limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Rate limiting: max 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'FinTrack API running' });
});

// Mount routers
const apiVersion = '/api/v1';
app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/transactions`, transactionRoutes);
app.use(`${apiVersion}/budgets`, budgetRoutes);
app.use(`${apiVersion}/debts`, debtRoutes);
app.use(`${apiVersion}/reminders`, reminderRoutes);
app.use(`${apiVersion}/summary`, summaryRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// ─── Database Connection & Server Start ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Async IIFE for DB connection and server start
(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ WARNING: MONGO_URI is not defined in .env. Skipping database connection.');
      // Start server anyway for testing routing
      app.listen(PORT, () => {
        console.log(`FinTrack server running on port ${PORT} (NO DB CONNECTION)`);
      });
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    app.listen(PORT, () => {
      console.log(`FinTrack server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
})();
