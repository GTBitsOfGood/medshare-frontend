const router = require('express').Router();

// Health check API endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'API is up and running!'
  });
});

module.exports = router;
