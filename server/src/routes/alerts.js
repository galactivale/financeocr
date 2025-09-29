const express = require('express');
const router = express.Router();

// Placeholder for alert routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Alerts endpoint - Coming soon',
    data: [],
  });
});

module.exports = router;
