const express = require("express");
const router = express.Router();
const Balance = require("../models/Balance");
const User = require("../models/User");

// Create a new balance entry
router.post("/", async (req, res) => {
  try {
    const { credit, debit, remark, currentPrice, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newBalance = new Balance({
      credit: credit || 0,
      debit: debit || 0,
      remark,
      currentPrice,
    });

    const savedBalance = await newBalance.save();

    // Add this balance to the user's balance array
    const user = await User.findById(userId);
    if (!user) {
      await Balance.findByIdAndDelete(savedBalance._id);
      return res.status(404).json({ message: "User not found" });
    }

    user.balance.push(savedBalance._id);

    // Update user's total amounts
    user.totalCredit += credit || 0;
    user.totalDebit += debit || 0;
    user.totalAmount = user.totalCredit - user.totalDebit;

    await user.save();

    res.status(201).json(savedBalance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all balance entries
router.get("/", async (req, res) => {
  try {
    const balances = await Balance.find();
    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific balance entry by ID
router.get("/:id", async (req, res) => {
  try {
    const balance = await Balance.findById(req.params.id);
    if (!balance) {
      return res.status(404).json({ message: "Balance not found" });
    }
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a balance entry
router.put("/:id", async (req, res) => {
  try {
    const { credit, debit, remark, currentPrice } = req.body;

    const balance = await Balance.findById(req.params.id);
    if (!balance) {
      return res.status(404).json({ message: "Balance not found" });
    }

    // Find the user who owns this balance
    const user = await User.findOne({ balance: req.params.id });
    if (user) {
      // Update user totals by removing old values
      user.totalCredit -= balance.credit || 0;
      user.totalDebit -= balance.debit || 0;

      // Add new values
      user.totalCredit += credit || 0;
      user.totalDebit += debit || 0;
      user.totalAmount = user.totalCredit - user.totalDebit;

      await user.save();
    }

    const updatedBalance = await Balance.findByIdAndUpdate(
      req.params.id,
      { credit, debit, remark, currentPrice },
      { new: true }
    );

    res.status(200).json(updatedBalance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a balance entry
router.delete("/:id", async (req, res) => {
  try {
    const balance = await Balance.findById(req.params.id);

    if (!balance) {
      return res.status(404).json({ message: "Balance not found" });
    }

    // Find the user who owns this balance and update their totals
    const user = await User.findOne({ balance: req.params.id });
    if (user) {
      user.totalCredit -= balance.credit || 0;
      user.totalDebit -= balance.debit || 0;
      user.totalAmount = user.totalCredit - user.totalDebit;

      // Remove this balance from the user's balance array
      user.balance = user.balance.filter(
        (balanceId) => balanceId.toString() !== req.params.id
      );

      await user.save();
    }

    await Balance.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Balance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
