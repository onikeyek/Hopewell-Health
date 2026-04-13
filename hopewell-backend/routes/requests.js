const express = require('express');
const router = express.Router();
const data = require('../data/hopewell.json');

// GET /api/requests?status=open&state=Lagos&priority=urgent
router.get('/', (req, res) => {
  let requests = data.assistance_requests;
  const { status, state, priority } = req.query;
  if (status) requests = requests.filter(r => r.status === status);
  if (state) requests = requests.filter(r => r.state.toLowerCase() === state.toLowerCase());
  if (priority) requests = requests.filter(r => r.priority === priority);
  res.json(requests);
});

// GET /api/requests/:id
router.get('/:id', (req, res) => {
  const request = data.assistance_requests.find(r => r.id === parseInt(req.params.id));
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json(request);
});

module.exports = router;
