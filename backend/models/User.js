// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
  },
  balance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Balance",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
