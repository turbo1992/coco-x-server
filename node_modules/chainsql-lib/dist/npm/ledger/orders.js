'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var utils = require('./utils');
var validate = utils.common.validate;

var parseAccountOrder = require('./parse/account-order');


function requestAccountOffers(connection, address, ledgerVersion, marker, limit) {
  return connection.request({
    command: 'account_offers',
    account: address,
    marker: marker,
    limit: utils.clamp(limit, 10, 400),
    ledger_index: ledgerVersion
  }).then(function (data) {
    return {
      marker: data.marker,
      results: data.offers.map(_.partial(parseAccountOrder, address))
    };
  });
}

function getOrders(address) {
  var _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  validate.getOrders({ address: address, options: options });

  return utils.ensureLedgerVersion.call(this, options).then(function (_options) {
    var getter = _.partial(requestAccountOffers, _this.connection, address, _options.ledgerVersion);
    return utils.getRecursive(getter, _options.limit).then(function (orders) {
      return _.sortBy(orders, function (order) {
        return order.properties.sequence;
      });
    });
  });
}

module.exports = getOrders;