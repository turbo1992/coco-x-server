'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var utils = require('./utils');
var validate = utils.common.validate;


function createEscrowExecutionTransaction(account, payment) {
  var txJSON = {
    TransactionType: 'EscrowFinish',
    Account: account,
    Owner: payment.owner,
    OfferSequence: payment.escrowSequence
  };

  if (Boolean(payment.condition) !== Boolean(payment.fulfillment)) {
    throw new ValidationError('"condition" and "fulfillment" fields on' + ' EscrowFinish must only be specified together.');
  }

  if (payment.condition !== undefined) {
    txJSON.Condition = payment.condition;
  }
  if (payment.fulfillment !== undefined) {
    txJSON.Fulfillment = payment.fulfillment;
  }
  if (payment.memos !== undefined) {
    txJSON.Memos = _.map(payment.memos, utils.convertMemo);
  }
  return txJSON;
}

function prepareEscrowExecution(address, escrowExecution) {
  var instructions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  validate.prepareEscrowExecution({ address: address, escrowExecution: escrowExecution, instructions: instructions });
  var txJSON = createEscrowExecutionTransaction(address, escrowExecution);
  return utils.prepareTransaction(txJSON, this, instructions);
}

module.exports = prepareEscrowExecution;