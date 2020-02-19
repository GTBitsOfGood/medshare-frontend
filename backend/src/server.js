const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const apiRoutes = require('./api/search');
const indexRoutes = require('./api/index');
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
app.use('/', indexRoutes);

// Error Handlers
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
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
