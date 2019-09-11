'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var utils = require('./utils');
var parsePaymentChannel = require('./parse/payment-channel');
var _utils$common = utils.common,
    validate = _utils$common.validate,
    removeUndefined = _utils$common.removeUndefined;

var NotFoundError = utils.common.errors.NotFoundError;

function formatResponse(response) {
  if (response.node !== undefined && response.node.LedgerEntryType === 'PayChannel') {
    return parsePaymentChannel(response.node);
  } else {
    throw new NotFoundError('Payment channel ledger entry not found');
  }
}

function getPaymentChannel(id) {
  validate.getPaymentChannel({ id: id });

  var request = {
    command: 'ledger_entry',
    index: id,
    binary: false,
    ledger_index: 'validated'
  };

  return this.connection.request(request).then(_.partial(formatResponse));
}

module.exports = getPaymentChannel;