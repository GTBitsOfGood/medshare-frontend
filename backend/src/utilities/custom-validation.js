const { validationResult } = require('express-validator');
const { ObjectId } = require('mongoose').Types;

function fileUploadedValidator(value, { req }) {
  return req.file;
}

function errorOnBadValidation(req, res, next) {
  if (!validationResult(req).isEmpty()) {
    res.status(500).send(validationResult(req));
  } else {
    next();
  }
}

function arrayToLowerCaseSanitizer(values) {
  return values.map(toLowerCaseSanitizer);
}

function toLowerCaseSanitizer(value) {
  return value.toLowerCase();
}

function arrayToMongoIdsSanitizer(array) {
  return array.map(toMongooseIdSanitizer);
}
function toMongooseIdSanitizer(value) {
  try {
    return ObjectId(value);
  } catch (error) {
    throw new Error(`Could not parse mongoose id for ${value}. ` + error);
  }
}

module.exports = {
  arrayToLowerCaseSanitizer,
  arrayToMongoIdsSanitizer,
  errorOnBadValidation,
  fileUploadedValidator,
  toLowerCaseSanitizer,
  toMongooseIdSanitizer
};
