const { databaseConnectUsingEnv } = require('../database');
require('dotenv').config();
const User = require('../database/models/User');

const args = process.argv.slice(2);
if (args.length < 2) {
  exit('Two positional arguments required: admin username, admin password');
}
databaseConnectUsingEnv().then(() => {
  findOrCreateUser(args[0], args[1]);
});

async function findOrCreateUser(username, password) {
  try {
    const user = await User.findOne({
      username
    });
    if (user) {
      exit('Username already exists: ' + username);
    }
  } catch (err) {
    console.log(err);
    exit('Error Occurred');
  }
  const user = new User({ username });
  user.setPassword(password);
  user
    .save()
    .then(() => {
      console.log('Successfully created admin user!');
      process.exit(0);
    })
    .catch(() => {
      exit('Error while creating new user');
    });
}

function exit(message) {
  console.log(message);
  process.exit(1);
}
