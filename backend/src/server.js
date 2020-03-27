const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const { databaseConnectUsingEnv } = require('./database');

const app = express();
require('./auth-setup');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Auth
app.use(passport.initialize());

// Add Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// Error Handlers
app.use((req, res, next) => {
  const err = new Error('Page Not Found.');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

// Bind app to local port
const port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
  console.log('Listening on port ' + port);
});

// MongoDB connection setup
databaseConnectUsingEnv();
