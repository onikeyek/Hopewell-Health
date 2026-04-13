const express = require('express');
const router = express.Router();
const data = require('../data/hopewell.json');

// GET /api/monthly
router.get('/', (req, res) => {
  res.json(data.monthly_trends);
});

module.exports = router;
