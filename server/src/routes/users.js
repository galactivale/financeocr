const express = require('express');
const router = express.Router();

// Placeholder for user routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Users endpoint - Coming soon',
    data: [],
  });
});

module.exports = router;
