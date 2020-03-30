const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET;

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (info) {
      res.status(400).json({
        message: info.message
      });
    } else {
      req.logIn(user, loginErr => {
        if (loginErr) {
          console.log(loginErr);
        } else {
          const token = jwt.sign({ id: user.username }, JWT_SECRET);
          res.json({
            token
          });
        }
      });
    }
    return null;
  })(req, res, next);
});

module.exports = router;
