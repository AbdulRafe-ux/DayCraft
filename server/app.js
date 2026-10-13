const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const csrfGuard = require('./middleware/csrf');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // allow the login cookie to be sent
  })
);
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ success: true, message: 'DayCraft API is running.' }));

app.use('/api', csrfGuard);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
