// models/Debit.js
const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema(
  {
    credit: {
      type: Number,
      default: 0,
    },
    debit: {
      type: Number,
      default: 0,
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Balance", balanceSchema);
