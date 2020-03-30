const mongoose = require('mongoose');

function databaseConnectUsingEnv() {
  if (!process.env.MONGO_URI) {
    console.error('ERR: MONGO_URI env variable not found');
    process.exit(1);
  } else {
    return databaseConnect(process.env.MONGO_URI);
  }
  return null;
}

function databaseConnect(databaseURI) {
  return mongoose
    .connect(databaseURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(err => {
      console.error('ERR: could not connect to MongoDB: ' + databaseURI);
      console.error(err.message);
      process.exit(1);
    });
}
module.exports = {
  databaseConnectUsingEnv
};
