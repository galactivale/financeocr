const express = require('express');
const router = express.Router();

// Placeholder for analytics routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Analytics endpoint - Coming soon',
    data: [],
  });
});

module.exports = router;
