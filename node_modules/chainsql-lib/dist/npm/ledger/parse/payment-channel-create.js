'use strict'; // eslint-disable-line strict

var assert = require('assert');
var utils = require('./utils');
var parseAmount = require('./amount');

function parsePaymentChannelCreate(tx) {
  assert(tx.TransactionType === 'PaymentChannelCreate');

  return utils.removeUndefined({
    amount: parseAmount(tx.Amount).value,
    destination: tx.Destination,
    settleDelay: tx.SettleDelay,
    publicKey: tx.PublicKey,
    cancelAfter: tx.CancelAfter && utils.parseTimestamp(tx.CancelAfter),
    sourceTag: tx.SourceTag,
    destinationTag: tx.DestinationTag
  });
}

module.exports = parsePaymentChannelCreate;