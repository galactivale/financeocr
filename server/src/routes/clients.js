const express = require('express');
const router = express.Router();

// Placeholder for client routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Clients endpoint - Coming soon',
    data: [],
  });
});

module.exports = router;
