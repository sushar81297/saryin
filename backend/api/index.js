require('dotenv').config();
const express = require('express');
const connectDB = require('../db');

const userRoutes = require('../routes/user');
const balanceRoutes = require('../routes/balance');
const authRoutes = require('../routes/auth');
const credentialRoutes = require('../routes/credential');
const inventoryRoutes = require('../routes/inventory');
const authMiddleware = require('../middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use(authMiddleware);
app.use('/api/users', userRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/credential', credentialRoutes);
app.use('/api/inventory', inventoryRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
