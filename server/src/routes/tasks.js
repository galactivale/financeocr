const express = require('express');
const router = express.Router();

// Placeholder for task routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Tasks endpoint - Coming soon',
    data: [],
  });
});

module.exports = router;
