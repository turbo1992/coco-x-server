'use strict'; // eslint-disable-line strict

var assert = require('assert');

function parseOrderCancellation(tx) {
  assert(tx.TransactionType === 'OfferCancel');
  return {
    orderSequence: tx.OfferSequence
  };
}

module.exports = parseOrderCancellation;