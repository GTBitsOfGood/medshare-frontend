const router = require('express').Router();
const extractionJobRoutes = require('./extraction-job');
const searchRoutes = require('./search');
const featuresRoutes = require('./features');
const userRoutes = require('./user');
const { checkOktaAuth } = require('../../utilities/auth');

// Health check API endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'API is up and running!'
  });
});

router.use('/extraction-job', [checkOktaAuth, extractionJobRoutes]);
router.use('/search', searchRoutes);
router.use('/features', featuresRoutes);
router.use('/user', [checkOktaAuth, userRoutes]);

module.exports = router;
