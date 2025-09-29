const express = require('express');
const router = express.Router();

// Placeholder for integration routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Integrations endpoint - Coming soon',
    data: [],
  });
});

module.exports = router;
