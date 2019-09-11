'use strict'; // eslint-disable-line strict

var assert = require('assert');
var utils = require('./utils');

function parseEscrowExecution(tx) {
  assert(tx.TransactionType === 'EscrowFinish');

  return utils.removeUndefined({
    memos: utils.parseMemos(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
    condition: tx.Condition,
    fulfillment: tx.Fulfillment
  });
}

module.exports = parseEscrowExecution;