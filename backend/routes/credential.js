const express = require('express');

const router = express.Router();
const Credential = require('../models/Credential');

router.get('/', async (req, res) => {
  try {
    const credentials = await Credential.find();
    return res.json(credentials);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id);
    if (!credential) return res.status(404).json({ message: 'Credential not found' });
    return res.json(credential);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCredential = await Credential.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.json(updatedCredential);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Credential.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Credential deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
