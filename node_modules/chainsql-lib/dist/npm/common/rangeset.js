'use strict'; // eslint-disable-line strict

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var assert = require('assert');
var ranges = Symbol();

function mergeIntervals(intervals) {
  var stack = [[-Infinity, -Infinity]];
  _.forEach(_.sortBy(intervals, function (x) {
    return x[0];
  }), function (interval) {
    var lastInterval = stack.pop();
    if (interval[0] <= lastInterval[1] + 1) {
      stack.push([lastInterval[0], Math.max(interval[1], lastInterval[1])]);
    } else {
      stack.push(lastInterval);
      stack.push(interval);
    }
  });
  return stack.slice(1);
}

var RangeSet = function () {
  function RangeSet() {
    _classCallCheck(this, RangeSet);

    this.reset();
  }

  _createClass(RangeSet, [{
    key: 'reset',
    value: function reset() {
      this[ranges] = [];
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return this[ranges].map(function (range) {
        return range[0].toString() + '-' + range[1].toString();
      }).join(',');
    }
  }, {
    key: 'addRange',
    value: function addRange(start, end) {
      assert(start <= end, 'invalid range');
      this[ranges] = mergeIntervals(this[ranges].concat([[start, end]]));
    }
  }, {
    key: 'addValue',
    value: function addValue(value) {
      this.addRange(value, value);
    }
  }, {
    key: 'parseAndAddRanges',
    value: function parseAndAddRanges(rangesString) {
      var _this = this;

      var rangeStrings = rangesString.split(',');
      _.forEach(rangeStrings, function (rangeString) {
        var range = rangeString.split('-').map(Number);
        _this.addRange(range[0], range.length === 1 ? range[0] : range[1]);
      });
    }
  }, {
    key: 'containsRange',
    value: function containsRange(start, end) {
      return _.some(this[ranges], function (range) {
        return range[0] <= start && range[1] >= end;
      });
    }
  }, {
    key: 'containsValue',
    value: function containsValue(value) {
      return this.containsRange(value, value);
    }
  }]);

  return RangeSet;
}();

module.exports.RangeSet = RangeSet;