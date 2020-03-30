const JWT_SECRET = process.env.SECRET;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('./database/models/User');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false
    },
    (username, password, done) => {
      User.findOne({
        username
      })
        .then(user => {
          if (user != null) {
            return done(null, false, { message: 'Username already taken' });
          }
          const newUser = new User({ username });
          newUser.setPassword(password);
          newUser.save().then(userDoc => {
            return done(null, userDoc);
          });
          return null;
        })
        .catch(done);
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false
    },
    (username, password, done) => {
      User.findOne({
        username
      })
        .then(user => {
          if (user === null) {
            return done(null, false, { message: 'Username not found' });
          }
          user.checkPassword(password).then(match => {
            if (!match) {
              return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
          });
          return null;
        })
        .catch(done);
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: JWT_SECRET
};

passport.use(
  'jwt',
  new JWTstrategy(opts, (jwtPayload, done) => {
    User.findOne({
      username: jwtPayload.id
    })
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, false, { message: 'Incorrect JWT' });
        }
      })
      .catch(done);
  })
);
