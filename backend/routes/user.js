const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Balance = require("../models/Balance");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, phoneNumber, remark, totalCredit, totalDebit, totalAmount } =
      req.body;
    const newUser = new User({
      name,
      phoneNumber,
      remark,
      totalCredit: totalCredit,
      totalDebit: totalDebit,
      totalAmount: totalCredit - totalDebit,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Add filter parameters
    const { name, phoneNumber } = req.query;
    const filter = {};

    // Add name filter (case-insensitive partial match)
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Add phone number filter (case-insensitive partial match)
    if (phoneNumber) {
      filter.phoneNumber = { $regex: phoneNumber, $options: "i" };
    }

    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
      .populate("balance")
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

// Get a specific user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("balance");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const { name, phoneNumber, remark, totalCredit, totalDebit, totalAmount } =
      req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const credit = totalCredit || user.totalCredit;
    const debit = totalDebit - user.totalDebit;
    const payload = {
      name: name || user.name,
      phoneNumber: phoneNumber || user.phoneNumber,
      remark: remark || user.remark,
      totalCredit: credit,
      totalDebit: debit,
      totalAmount: credit - debit,
    };
    const updatedUser = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all associated balance entries
    if (user.balance && user.balance.length > 0) {
      await Balance.deleteMany({ _id: { $in: user.balance } });
    }

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "User and associated balances deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a balance to a user
router.post("/:id/balance", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { credit, debit, paidStatus } = req.body;

    const newBalance = new Balance({
      credit: credit || 0,
      debit: debit || 0,
      paidStatus: paidStatus || "notPaid",
    });

    const savedBalance = await newBalance.save();

    // Update user's balance array and totals
    user.balance.push(savedBalance._id);
    user.totalCredit += credit || 0;
    user.totalDebit += debit || 0;
    user.totalAmount = user.totalCredit - user.totalDebit;

    await user.save();

    res.status(201).json({
      user,
      addedBalance: savedBalance,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's balance summary
router.get("/:id/summary", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("balance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const paidBalances = user.balance.filter((b) => b.paidStatus === "paided");
    const unpaidBalances = user.balance.filter(
      (b) => b.paidStatus === "notPaid"
    );

    res.status(200).json({
      userId: user._id,
      userName: user.name,
      totalCredit: user.totalCredit,
      totalDebit: user.totalDebit,
      totalAmount: user.totalAmount,
      paidBalancesCount: paidBalances.length,
      unpaidBalancesCount: unpaidBalances.length,
      totalBalancesCount: user.balance.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
