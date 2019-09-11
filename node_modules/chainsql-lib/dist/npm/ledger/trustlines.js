'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var utils = require('./utils');
var validate = utils.common.validate;

var parseAccountTrustline = require('./parse/account-trustline');


function currencyFilter(currency, trustline) {
  return currency === null || trustline.specification.currency === currency;
}

function formatResponse(options, data) {
  return {
    marker: data.marker,
    results: data.lines.map(parseAccountTrustline).filter(_.partial(currencyFilter, options.currency || null))
  };
}

function getAccountLines(connection, address, ledgerVersion, options, marker, limit) {
  var request = {
    command: 'account_lines',
    account: address,
    ledger_index: ledgerVersion,
    marker: marker,
    limit: utils.clamp(limit, 10, 400),
    peer: options.counterparty
  };

  return connection.request(request).then(_.partial(formatResponse, options));
}

function getTrustlines(address) {
  var _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  validate.getTrustlines({ address: address, options: options });

  return this.getLedgerVersion().then(function (ledgerVersion) {
    var getter = _.partial(getAccountLines, _this.connection, address, options.ledgerVersion || ledgerVersion, options);
    return utils.getRecursive(getter, options.limit);
  });
}

module.exports = getTrustlines;