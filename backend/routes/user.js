const express = require('express');

const router = express.Router();
const User = require('../models/User');
const Balance = require('../models/Balance');

router.post('/', async (req, res) => {
  try {
    const { name, phoneNumber, remark, totalCredit, totalDebit, type } = req.body;
    const newUser = new User({
      name,
      phoneNumber,
      remark,
      totalCredit,
      totalDebit,
      type,
      totalAmount: totalCredit - totalDebit,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const { name, phoneNumber } = req.query;
    const filter = {};

    if (name || phoneNumber) {
      filter.$or = [];

      if (name) {
        filter.$or.push({ name: { $regex: name, $options: 'i' } });
      }

      if (phoneNumber) {
        filter.$or.push({
          phoneNumber: { $regex: phoneNumber, $options: 'i' },
        });
      }
    }
    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
      .populate('balance')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'balance',
      options: { sort: { createdAt: -1 } }, // Sort balance in descending order by createdAt
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, phoneNumber, remark, totalCredit, totalDebit, type } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const credit = totalCredit || user.totalCredit;
    const debit = totalDebit || user.totalDebit;
    const payload = {
      name: name || user.name,
      phoneNumber: phoneNumber || user.phoneNumber,
      remark: remark || user.remark,
      totalCredit: credit,
      totalDebit: debit,
      type,
      totalAmount: credit - debit,
    };
    const updatedUser = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all associated balance entries
    if (user.balance && user.balance.length > 0) {
      await Balance.deleteMany({ _id: { $in: user.balance } });
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'User and associated balances deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/:id/balance', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { credit, debit } = req.body;

    const newBalance = new Balance({
      credit: credit || 0,
      debit: debit || 0,
    });

    const savedBalance = await newBalance.save();

    // Update user's balance array and totals
    user.balance.push(savedBalance._id);
    user.totalCredit += credit || 0;
    user.totalDebit += debit || 0;
    user.totalAmount = user.totalCredit - user.totalDebit;

    await user.save();

    return res.status(201).json({
      user,
      addedBalance: savedBalance,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
