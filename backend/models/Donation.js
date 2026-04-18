const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  causeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cause', required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'refunded', 'voided'], default: 'active' },
});

module.exports = mongoose.model('Donation', donationSchema);
