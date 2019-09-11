'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var utils = require('./utils');
var parseFields = require('./parse/fields');
var validate = utils.common.validate;

var AccountFlags = utils.common.constants.AccountFlags;

function parseFlags(value) {
  var settings = {};
  for (var flagName in AccountFlags) {
    if (value & AccountFlags[flagName]) {
      settings[flagName] = true;
    }
  }
  return settings;
}

function formatSettings(response) {
  var data = response.account_data;
  var parsedFlags = parseFlags(data.Flags);
  var parsedFields = parseFields(data);
  return _.assign({}, parsedFlags, parsedFields);
}

function getSettings(address) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  validate.getSettings({ address: address, options: options });

  var request = {
    command: 'account_info',
    account: address,
    ledger_index: options.ledgerVersion || 'validated'
  };

  return this.connection.request(request).then(formatSettings);
}

module.exports = getSettings;