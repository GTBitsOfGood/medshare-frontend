const pluralize = require('pluralize');

pluralize.addSingularRule(/dialysis$/i, 'dialysis');
module.exports = pluralize;
