'use strict'; // eslint-disable-line strict

var assert = require('assert');
var utils = require('./utils');
var parseAmount = require('./amount');

function parsePaymentChannelFund(tx) {
  assert(tx.TransactionType === 'PaymentChannelFund');

  return utils.removeUndefined({
    channel: tx.Channel,
    amount: parseAmount(tx.Amount).value,
    expiration: tx.Expiration && utils.parseTimestamp(tx.Expiration)
  });
}

module.exports = parsePaymentChannelFund;