const express = require('express');
const router = express.Router();
const data = require('../data/hopewell.json');

// GET /api/stories
router.get('/', (req, res) => {
  res.json(data.success_stories);
});

module.exports = router;
