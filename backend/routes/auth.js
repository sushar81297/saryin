const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const Credential = require('../models/Credential');

const { JWT_SECRET } = process.env;

router.post('/register', async (req, res) => {
  try {
    const { username, password, phoneNumber, permissions } = req.body;

    const existingUser = await Credential.findOne({
      $or: [{ username }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or Phone Number already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCredential = new Credential({
      username,
      password: hashedPassword,
      phoneNumber,
      permissions,
    });

    const savedCredential = await newCredential.save();
    return res
      .status(201)
      .json({ message: 'User registered successfully', id: savedCredential._id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await Credential.findOne({
      $or: [{ username: login }, { phoneNumber: login }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    const token = jwt.sign({ id: user._id, permissions: user.permissions }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.json({ message: 'Login successful', token, permissions: user.permissions });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
