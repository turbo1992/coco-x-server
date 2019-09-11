'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var parseAmount = require('./amount');


function parsePaths(paths) {
  return paths.map(function (steps) {
    return steps.map(function (step) {
      return _.omit(step, ['type', 'type_hex']);
    });
  });
}

function removeAnyCounterpartyEncoding(address, amount) {
  return amount.counterparty === address ? _.omit(amount, 'counterparty') : amount;
}

function createAdjustment(address, adjustmentWithoutAddress) {
  var amountKey = _.keys(adjustmentWithoutAddress)[0];
  var amount = adjustmentWithoutAddress[amountKey];
  return _.set({ address: address }, amountKey, removeAnyCounterpartyEncoding(address, amount));
}

function parseAlternative(sourceAddress, destinationAddress, destinationAmount, alternative) {
  // we use "maxAmount"/"minAmount" here so that the result can be passed
  // directly to preparePayment
  var amounts = alternative.destination_amount !== undefined ? { source: { amount: parseAmount(alternative.source_amount) },
    destination: { minAmount: parseAmount(alternative.destination_amount) } } : { source: { maxAmount: parseAmount(alternative.source_amount) },
    destination: { amount: parseAmount(destinationAmount) } };

  return {
    source: createAdjustment(sourceAddress, amounts.source),
    destination: createAdjustment(destinationAddress, amounts.destination),
    paths: JSON.stringify(parsePaths(alternative.paths_computed))
  };
}

function parsePathfind(pathfindResult) {
  var sourceAddress = pathfindResult.source_account;
  var destinationAddress = pathfindResult.destination_account;
  var destinationAmount = pathfindResult.destination_amount;
  return pathfindResult.alternatives.map(_.partial(parseAlternative, sourceAddress, destinationAddress, destinationAmount));
}

module.exports = parsePathfind;