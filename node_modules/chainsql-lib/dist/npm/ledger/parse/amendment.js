'use strict'; // eslint-disable-line strict

function parseAmendment(tx) {
  return {
    amendment: tx.Amendment
  };
}

module.exports = parseAmendment;