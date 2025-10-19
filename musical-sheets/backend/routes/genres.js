const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');
const auth = require('../middleware/auth');

// Get all genres
router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new genre
router.post('/', auth, async (req, res) => {
  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.status(201).json(genre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
