const express = require('express');
const router = express.Router();
const data = require('../data/hopewell.json');

// GET /api/states
router.get('/', (req, res) => {
  res.json(data.states);
});

// GET /api/states/:id
router.get('/:id', (req, res) => {
  const state = data.states.find(s => s.id === parseInt(req.params.id));
  if (!state) return res.status(404).json({ error: 'State not found' });
  res.json(state);
});

module.exports = router;
