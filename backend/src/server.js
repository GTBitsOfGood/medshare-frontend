const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const apiRoutes = require('./api');
const { databaseConnectUsingEnv } = require('./database');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET || 'DEFAULT_SECRET',
    resave: false,
    saveUninitialized: false
  })
);

// Add API routes
app.use('/api', apiRoutes);

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
