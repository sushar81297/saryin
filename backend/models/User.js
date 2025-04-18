// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    remark: {
      type: String,
    },
    totalCredit: {
      type: Number,
      default: 0,
    },
    totalDebit: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    balance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Balance",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
