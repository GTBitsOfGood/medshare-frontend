const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./api/search');
const indexRoutes = require('./api/index');

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
if (!process.env.MONGO_URI) {
  console.error('ERR: MONGO_URI env variable not found');
  process.exit(1);
} else {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(err => {
      console.error(
        'ERR: could not connect to MongoDB: ' + process.env.MONGO_URI
      );
      console.error(err.message);
      process.exit(1);
    });
}
