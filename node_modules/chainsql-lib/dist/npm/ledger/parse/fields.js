'use strict'; // eslint-disable-line strict

var _ = require('lodash');
var BigNumber = require('bignumber.js');
var AccountFields = require('./utils').constants.AccountFields;

function parseField(info, value) {
  if (info.encoding === 'hex' && !info.length) {
    // e.g. "domain"
    return new Buffer(value, 'hex').toString('ascii');
  }
  if (info.shift) {
    return new BigNumber(value).shift(-info.shift).toNumber();
  }
  return value;
}

function parseFields(data) {
  var settings = {};
  for (var fieldName in AccountFields) {
    var fieldValue = data[fieldName];
    if (fieldValue !== undefined) {
      var info = AccountFields[fieldName];
      settings[info.name] = parseField(info, fieldValue);
    }
  }

  if (data.RegularKey) {
    settings.regularKey = data.RegularKey;
  }

  // TODO: this isn't implemented in rippled yet, may have to change this later
  if (data.SignerQuorum || data.SignerEntries) {
    settings.signers = {};
    if (data.SignerQuorum) {
      settings.signers.threshold = data.SignerQuorum;
    }
    if (data.SignerEntries) {
      settings.signers.weights = _.map(data.SignerEntries, function (entry) {
        return {
          address: entry.SignerEntry.Account,
          weight: entry.SignerEntry.SignerWeight
        };
      });
    }
  }
  return settings;
}

module.exports = parseFields;