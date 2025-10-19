const express = require('express');
const router = express.Router();
const Sheet = require('../models/Sheet');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// GET all sheets
router.get('/', async (req, res) => {
  try {
    const sheets = await Sheet.find().populate('uploader', 'username');
    res.json(sheets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sheets', error: err.message });
  }
});

// GET single sheet
router.get('/:id', async (req, res) => {
  try {
    const sheet = await Sheet.findById(req.params.id).populate('uploader', 'username email');
    if (!sheet) return res.status(404).json({ message: 'Sheet not found' });
    res.json(sheet);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sheet', error: err.message });
  }
});

// CREATE new sheet (protected)
router.post('/', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, composer, description, instrument, genre, difficulty, duration, key, tempo, period, pages, tags, isPublic } = req.body;

    const fileUrl = req.files['file'] ? req.files['file'][0].path : null;
    const imageUrl = req.files['image'] ? req.files['image'][0].path : null;

    const sheet = new Sheet({
      title,
      composer,
      description,
      instrument,
      genre,
      difficulty,
      duration,
      key,
      tempo,
      period,
      pages,
      tags: tags ? tags.split(',') : [],
      isPublic: isPublic === 'true',
      fileUrl,
      imageUrl,
      uploader: req.user._id
    });

    await sheet.save();
    await sheet.populate('uploader', 'username');
    res.status(201).json(sheet);
  } catch (err) {
    res.status(500).json({ message: 'Error creating sheet', error: err.message });
  }
});

// UPDATE sheet (protected)
router.put('/:id', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
  try {
    const sheet = await Sheet.findById(req.params.id);
    if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

    // Check if user owns the sheet
    if (sheet.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, composer, description, instrument, genre, difficulty, duration, key, tempo, period, pages, tags, isPublic } = req.body;

    const fileUrl = req.files['file'] ? req.files['file'][0].path : sheet.fileUrl;
    const imageUrl = req.files['image'] ? req.files['image'][0].path : sheet.imageUrl;

    const updatedSheet = await Sheet.findByIdAndUpdate(
      req.params.id,
      {
        title,
        composer,
        description,
        instrument,
        genre,
        difficulty,
        duration,
        key,
        tempo,
        period,
        pages,
        tags: tags ? tags.split(',') : sheet.tags,
        isPublic: isPublic === 'true',
        fileUrl,
        imageUrl
      },
      { new: true }
    ).populate('uploader', 'username');

    res.json(updatedSheet);
  } catch (err) {
    res.status(500).json({ message: 'Error updating sheet', error: err.message });
  }
});

// DELETE sheet (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const sheet = await Sheet.findById(req.params.id);
    if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

    // Check if user owns the sheet
    if (sheet.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Sheet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sheet deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting sheet', error: err.message });
  }
});

module.exports = router;