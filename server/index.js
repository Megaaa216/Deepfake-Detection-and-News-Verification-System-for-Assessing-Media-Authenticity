const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// morgan to console
app.use(morgan('dev'));
// morgan to file
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CLIENT_URL = process.env.CLIENT_URL || '*';
app.use(cors({ origin: CLIENT_URL, credentials: true, optionsSuccessStatus: 200 }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/deepfake', require('./routes/deepfake'));
app.use('/api/history', require('./routes/history'));
app.use('/api/reports', require('./routes/reports'));

// 404
app.use(require('./middleware/notFound'));

// Error handler
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
