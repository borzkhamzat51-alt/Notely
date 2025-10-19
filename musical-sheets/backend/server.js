require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const composerRoutes = require('./routes/composers');
const sheetRoutes = require('./routes/sheets');

const app = express();

app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI).catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sheets', require('./routes/sheets'));
app.use('/api/composers', require('./routes/composers')); // create this file
app.use('/api/genres', require('./routes/genres'));
app.use('/api/instruments', require('./routes/instruments'));
app.use('/api/events', require('./routes/events'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/composers', composerRoutes);
app.use('/api/sheets', sheetRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});