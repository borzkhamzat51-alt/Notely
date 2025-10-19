const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');
const auth = require('../middleware/auth');

// Get all instruments
router.get('/', async (req, res) => {
  try {
    const instruments = await Instrument.find().sort({ name: 1 });
    res.json(instruments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new instrument
router.post('/', auth, async (req, res) => {
  try {
    const instrument = new Instrument(req.body);
    await instrument.save();
    res.status(201).json(instrument);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
