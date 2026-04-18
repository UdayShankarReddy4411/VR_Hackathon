const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cause = require('../models/Cause');
const Donation = require('../models/Donation');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Apply admin middleware to all routes in this file
router.use(verifyToken, isAdmin);

// --- User Management ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'ngo' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Cause Management ---
router.get('/causes', async (req, res) => {
  try {
    const causes = await Cause.find().populate('createdBy', 'name email status');
    res.json(causes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/causes/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const cause = await Cause.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!cause) return res.status(404).json({ error: 'Cause not found' });
    res.json(cause);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/causes/:id', async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ error: 'Cause not found' });
    await Donation.deleteMany({ causeId: cause._id });
    await cause.deleteOne();
    res.json({ message: 'Cause and associated donations deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Donation Ledger ---
router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find().populate({
      path: 'causeId',
      select: 'title',
      populate: { path: 'createdBy', select: 'name' }
    }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/donations/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'refunded', 'voided'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const donation = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
