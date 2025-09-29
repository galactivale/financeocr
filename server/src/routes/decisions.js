const express = require('express');
const router = express.Router();

// Placeholder for decision routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Decisions endpoint - Coming soon',
    data: [],
  });
});

module.exports = router;
