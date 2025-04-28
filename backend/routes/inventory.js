const express = require('express');

const router = express.Router();
const InventoryItem = require('../models/InventoryItem');

router.get('/', async (req, res) => {
  try {
    const { name, page = 1, limit = 20 } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const items = await InventoryItem.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const totalCount = await InventoryItem.countDocuments(query);

    const formattedItems = items.map((item) => {
      const latestPriceEntry = item.prices[item.prices.length - 1];
      return {
        id: item._id,
        name: item.name,
        latestPrice: latestPriceEntry ? latestPriceEntry.value : null,
        priceDate: latestPriceEntry ? latestPriceEntry.changedAt : null,
        createdAt: item.createdAt,
      };
    });

    res.json({
      totalItems: totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      items: formattedItems,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { name, price } = req.body;

    const item = new InventoryItem({
      name,
      prices: [{ value: price }],
    });

    await item.save();
    return res.status(201).json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put('/update-price/:id', async (req, res) => {
  try {
    const { name, price } = req.body;
    const { id } = req.params;

    if (!price) {
      return res.status(400).json({ message: 'Price is required' });
    }

    const item = await InventoryItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.prices.push({ value: price });
    if (name) {
      item.name = name;
    }
    await item.save();

    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (item && item.prices.length > 0) {
      item.prices = item.prices.sort((a, b) => b.changedAt - a.changedAt);
    }
    if (!item) return res.status(404).json({ message: 'Item not found' });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await InventoryItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/:inventoryId/price/:priceId', async (req, res) => {
  const { inventoryId, priceId } = req.params;

  if (!inventoryId || !priceId) {
    return res.status(400).json({ message: 'Inventory ID and price ID are required' });
  }

  try {
    const inventoryItem = await InventoryItem.findById(inventoryId);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    const priceIndex = inventoryItem.prices.findIndex((price) => price._id.toString() === priceId);

    if (priceIndex === -1) {
      return res.status(404).json({ message: 'Price not found' });
    }

    inventoryItem.prices.splice(priceIndex, 1);

    await inventoryItem.save();

    return res.json({ message: 'Price deleted successfully', inventoryItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
