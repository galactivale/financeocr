const express = require('express');
const router = express.Router();

// Placeholder for document routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Documents endpoint - Coming soon',
    data: [],
  });
});

module.exports = router;
