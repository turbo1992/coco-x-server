'use strict'; // eslint-disable-line strict

var utils = require('./utils');
var validate = utils.common.validate;

var parseLedger = require('./parse/ledger');


function getLedger() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  validate.getLedger({ options: options });

  var request = {
    command: 'ledger',
    ledger_index: options.ledgerVersion || 'validated',
    expand: options.includeAllData,
    transactions: options.includeTransactions,
    accounts: options.includeState
  };

  return this.connection.request(request).then(function (response) {
    return parseLedger(response.ledger);
  });
}

module.exports = getLedger;