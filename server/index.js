const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env into process.env
dotenv.config();

// Create Express app
const app = express();

// Request logging: console
app.use(morgan('dev'));
// Request logging: file (combined format)
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow requests from the frontend origin (set CLIENT_URL in .env)
const CLIENT_URL = process.env.CLIENT_URL || '*';
app.use(cors({ origin: CLIENT_URL, credentials: true, optionsSuccessStatus: 200 }));

// Serve uploaded files statically from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/deepfake', require('./routes/deepfake'));
app.use('/api/history', require('./routes/history'));
app.use('/api/reports', require('./routes/reports'));

// 404 handler (must be after routes)
app.use(require('./middleware/notFound'));

// Centralized error handler (must be last middleware)
app.use(require('./middleware/errorHandler'));

const start = async () => {
  try {
    const connectDB = require('./config/db');
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
