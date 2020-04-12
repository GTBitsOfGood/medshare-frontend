const OktaJwtVerifier = require('@okta/jwt-verifier');
const okta = require('@okta/okta-sdk-nodejs');

const oktaClient = new okta.Client({
  orgUrl: process.env.OKTA_DOMAIN,
  token: process.env.OKTA_API_TOKEN
});

const jwtVerifier = new OktaJwtVerifier({
  issuer: process.env.OKTA_DOMAIN + '/oauth2/default',
  assertClaims: {
    aud: 'api://default'
  }
});

const checkOktaAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.status(401).json({
        message: 'Authorization header is required'
      });
      return;
    }

    const accessToken = req.headers.authorization.trim().split(' ')[1];
    await jwtVerifier.verifyAccessToken(accessToken, 'api://default');
    next();
  } catch (error) {
    next(error);
  }
};

const updateUserPassword = async (username, password) => {
  const user = await oktaClient.getUser(username);
  user.credentials.password = password;
  return user.update();
};

module.exports = {
  checkOktaAuth,
  updateUserPassword
};
