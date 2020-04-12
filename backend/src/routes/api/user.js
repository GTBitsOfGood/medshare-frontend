const router = require('express').Router();
const { body } = require('express-validator');

const { updateUserPassword } = require('../../utilities/auth');
const { errorOnBadValidation } = require('../../utilities/custom-validation');

router.put('/credentials', [
  body('username', 'Username field is required').exists(),
  body('password', 'Password field is required').exists(),
  errorOnBadValidation,
  async (req, res, next) => {
    try {
      await updateUserPassword(req.body.username, req.body.password);
      res.json({
        message: 'Successfully updated user password'
      });
    } catch (err) {
      next(err);
    }
  }
]);

module.exports = router;
