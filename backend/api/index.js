require('dotenv').config();
const express = require('express');
const connectDB = require('../db');

const userRoutes = require('../routes/user');
const balanceRoutes = require('../routes/balance');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/balance', balanceRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
