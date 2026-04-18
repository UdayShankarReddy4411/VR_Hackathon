const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause');
const Donation = require('../models/Donation');
const { verifyToken } = require('../middleware/auth');

// List all approved causes
router.get('/', async (req, res) => {
  try {
    const causes = await Cause.find({ status: 'approved' }).populate('createdBy', 'name status');
    // Filter out causes where the NGO is suspended
    const activeCauses = causes.filter(c => c.createdBy && c.createdBy.status !== 'suspended');
    res.json(activeCauses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List my causes (NGO)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const causes = await Cause.find({ createdBy: req.user.userId }).populate('createdBy', 'name');
    res.json(causes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Single cause detail
router.get('/:id', async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id).populate('createdBy', 'name');
    if (!cause) return res.status(404).json({ error: 'Cause not found' });
    res.json(cause);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create cause (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, goalAmount, imageUrl } = req.body;
    const newCause = new Cause({
      title,
      description,
      goalAmount,
      imageUrl,
      createdBy: req.user.userId
    });
    await newCause.save();
    res.status(201).json(newCause);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cause (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ error: 'Cause not found' });
    if (cause.createdBy.toString() !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

    Object.assign(cause, req.body);
    await cause.save();
    res.json(cause);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete cause (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ error: 'Cause not found' });
    if (cause.createdBy.toString() !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

    // Remove associated donations
    await Donation.deleteMany({ causeId: cause._id });
    await cause.deleteOne();
    
    res.json({ message: 'Cause deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// Flag a cause (Public)
router.post('/:id/flag', async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ error: 'Cause not found' });
    
    cause.flags.push(req.body.reason || 'Suspicious activity');
    await cause.save();
    
    res.json({ message: 'Cause flagged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
