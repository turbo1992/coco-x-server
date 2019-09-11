'use strict'; // eslint-disable-line strict

var assert = require('assert');
var utils = require('./utils');

function parseEscrowCancellation(tx) {
  assert(tx.TransactionType === 'EscrowCancel');

  return utils.removeUndefined({
    memos: utils.parseMemos(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence
  });
}

module.exports = parseEscrowCancellation;