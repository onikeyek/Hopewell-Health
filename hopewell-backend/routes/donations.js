const express = require('express');
const router = express.Router();
const data = require('../data/hopewell.json');

// GET /api/donations
router.get('/', (req, res) => {
  res.json(data.donation_rates);
});

module.exports = router;
