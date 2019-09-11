'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var utils = require('./utils');
var validate = utils.common.validate;


function createEscrowCancellationTransaction(account, payment) {
  var txJSON = {
    TransactionType: 'EscrowCancel',
    Account: account,
    Owner: payment.owner,
    OfferSequence: payment.escrowSequence
  };
  if (payment.memos !== undefined) {
    txJSON.Memos = _.map(payment.memos, utils.convertMemo);
  }
  return txJSON;
}

function prepareEscrowCancellation(address, escrowCancellation) {
  var instructions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  validate.prepareEscrowCancellation({ address: address, escrowCancellation: escrowCancellation, instructions: instructions });
  var txJSON = createEscrowCancellationTransaction(address, escrowCancellation);
  return utils.prepareTransaction(txJSON, this, instructions);
}

module.exports = prepareEscrowCancellation;