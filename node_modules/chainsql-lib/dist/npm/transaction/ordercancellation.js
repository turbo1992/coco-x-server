'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var utils = require('./utils');
var validate = utils.common.validate;


function createOrderCancellationTransaction(account, orderCancellation) {
  var txJSON = {
    TransactionType: 'OfferCancel',
    Account: account,
    OfferSequence: orderCancellation.orderSequence
  };
  if (orderCancellation.memos !== undefined) {
    txJSON.Memos = _.map(orderCancellation.memos, utils.convertMemo);
  }
  return txJSON;
}

function prepareOrderCancellation(address, orderCancellation) {
  var instructions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  validate.prepareOrderCancellation({ address: address, orderCancellation: orderCancellation, instructions: instructions });
  var txJSON = createOrderCancellationTransaction(address, orderCancellation);
  return utils.prepareTransaction(txJSON, this, instructions);
}

module.exports = prepareOrderCancellation;