const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { verifyToken } = require('../middleware/auth');

// Create new donation
router.post('/', async (req, res) => {
  try {
    const { donorName, amount, causeId } = req.body;
    const donation = new Donation({ donorName, amount, causeId });
    await donation.save();
    res.status(201).json({ message: 'Donation successful', donation });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donations and aggregate raised amount for a specific cause
router.get('/:causeId', async (req, res) => {
  try {
    const donations = await Donation.find({ causeId: req.params.causeId }).sort({ createdAt: -1 });
    
    const raisedAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    res.json({
      raisedAmount,
      donations
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
