const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Charity Platform API is running...');
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/causes', require('./routes/causes'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/admin', require('./routes/admin'));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/charity_platform')
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('MongoDB connection error:', err));
