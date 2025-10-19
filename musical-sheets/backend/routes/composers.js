const express = require('express');
const router = express.Router();
const Composer = require('../models/Composer');
const auth = require('../middleware/auth');

// Get all composers
router.get('/', async (req, res) => {
  try {
    const composers = await Composer.find().sort({ name: 1 });
    res.json(composers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new composer (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const composer = new Composer(req.body);
    await composer.save();
    res.status(201).json(composer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
