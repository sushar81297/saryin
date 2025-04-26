const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    prices: [priceSchema],
  },
  { timestamps: true }
);

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

module.exports = InventoryItem;
