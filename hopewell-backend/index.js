const express = require('express');
const cors = require('cors');
const path = require('path');

const statesRouter = require('./routes/states');
const requestsRouter = require('./routes/requests');
const storiesRouter = require('./routes/stories');
const monthlyRouter = require('./routes/monthly');
const donationsRouter = require('./routes/donations');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    /\.github\.io$/,
    /\.onrender\.com$/
  ]
}));
app.use(express.json());

// Serve static data files
app.use('/data', express.static(path.join(__dirname, '../hopewell-frontend/data')));

// API routes
app.use('/api/states', statesRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/monthly', monthlyRouter);
app.use('/api/donations', donationsRouter);

// Error middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`HopeWell server running on http://localhost:${PORT}`);
});
