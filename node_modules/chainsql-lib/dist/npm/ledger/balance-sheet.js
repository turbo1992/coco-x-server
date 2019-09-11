'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var utils = require('./utils');
var validate = utils.common.validate;


function formatBalanceSheet(balanceSheet) {
  var result = {};

  if (!_.isUndefined(balanceSheet.balances)) {
    result.balances = [];
    _.forEach(balanceSheet.balances, function (balances, counterparty) {
      _.forEach(balances, function (balance) {
        result.balances.push(Object.assign({ counterparty: counterparty }, balance));
      });
    });
  }
  if (!_.isUndefined(balanceSheet.assets)) {
    result.assets = [];
    _.forEach(balanceSheet.assets, function (assets, counterparty) {
      _.forEach(assets, function (balance) {
        result.assets.push(Object.assign({ counterparty: counterparty }, balance));
      });
    });
  }
  if (!_.isUndefined(balanceSheet.obligations)) {
    result.obligations = _.map(balanceSheet.obligations, function (value, currency) {
      return { currency: currency, value: value };
    });
  }

  return result;
}

function getBalanceSheet(address) {
  var _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  validate.getBalanceSheet({ address: address, options: options });

  return utils.ensureLedgerVersion.call(this, options).then(function (_options) {
    var request = {
      command: 'gateway_balances',
      account: address,
      strict: true,
      hotwallet: _options.excludeAddresses,
      ledger_index: _options.ledgerVersion
    };

    return _this.connection.request(request).then(formatBalanceSheet);
  });
}

module.exports = getBalanceSheet;