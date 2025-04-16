const express = require("express");
const router = express.Router();
const Balance = require("../models/Balance");
const User = require("../models/User");

// Create a new balance entry
router.post("/", async (req, res) => {
  try {
    const { credit, debit, paidedAmount, paidStatus, userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
    }

    const newBalance = new Balance({
      credit: credit || 0,
      debit: debit || 0,
      paidedAmount: paidedAmount || 0,
      paidStatus: paidStatus || "notPaid",
    });

    const savedBalance = await newBalance.save();

    // If userId is provided, add this balance to the user's debits array
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.debits.push(savedBalance._id);
        await user.save();
      }
    }

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
    const { credit, debit, paidedAmount, paidStatus } = req.body;

    const updatedBalance = await Balance.findByIdAndUpdate(
      req.params.id,
      { credit, debit, paidedAmount, paidStatus },
      { new: true }
    );

    if (!updatedBalance) {
      return res.status(404).json({ message: "Balance not found" });
    }

    res.status(200).json(updatedBalance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update payment status
router.patch("/:id/payment", async (req, res) => {
  try {
    const { paidStatus, paidedAmount } = req.body;
    const balance = await Balance.findById(req.params.id);

    if (!balance) {
      return res.status(404).json({ message: "Balance not found" });
    }

    balance.paidStatus = paidStatus || balance.paidStatus;
    balance.paidedAmount = paidedAmount || balance.paidedAmount;

    // Update status based on payment
    const totalDebt = balance.debit;

    if (balance.paidedAmount >= totalDebt) {
      balance.paidStatus = "paided";
    } else if (balance.paidedAmount > 0) {
      balance.paidStatus = "remain";
    } else {
      balance.paidStatus = "notPaid";
    }

    const updatedBalance = await balance.save();
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

    // Remove this balance from any users that have it
    await User.updateMany(
      { debits: req.params.id },
      { $pull: { debits: req.params.id } }
    );

    await Balance.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Balance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get total balance summary
router.get("/summary/total", async (req, res) => {
  try {
    const balances = await Balance.find();

    let totalCredit = 0;
    let totalDebit = 0;
    let totalPaided = 0;

    balances.forEach((balance) => {
      totalCredit += balance.credit || 0;
      totalDebit += balance.debit || 0;
      totalPaided += balance.paidedAmount || 0;
    });

    const netBalance = totalCredit - totalDebit;
    const remainingDebt = totalDebit - totalPaided;

    res.status(200).json({
      totalCredit,
      totalDebit,
      totalPaided,
      netBalance,
      remainingDebt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
