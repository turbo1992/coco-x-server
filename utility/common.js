"use strict";

const _ = require('lodash');
const config = require("../configs");

async function doPaymentPrepareSign(dbObj,netAPI, srcAddr, srcSec, payment) {
    return new Promise(function (resolve, reject) {
        netAPI.preparePayment(srcAddr, payment).then((tx) => {
            try {
                let signed = netAPI.sign(tx.txJSON, srcSec);
                var retObj = {};
                retObj.lastLedgerSequence = JSON.parse(tx.txJSON).LastLedgerSequence;
                retObj.signed = signed;
                resolve(retObj)
            } catch (error) {
                //reject("fail to sign for : " + srcAddr);
                let err = "Sign for " + srcAddr + " error : " + error;
                reject(err);
            }
        }).catch((error) => {
            let err = "Prepare tx for " + srcAddr + " error : " + error;
            reject(err);
        })
    })
}

async function doPaymentSubmit(netAPI, signedTx) {
    return new Promise(function (resolve, reject) {
        netAPI.submit(signedTx).then(transferResult => {
            if (("tesSUCCESS" === transferResult.resultCode) || (_.startsWith(transferResult.resultCode, "ter"))) {
                resolve(transferResult.resultCode);
            } else {
                reject(transferResult.resultCode);
            }
        }).catch(error => {
            reject(error);
        });
    })
}

async function verifyTransaction(txType, netAPI, hash, lastLedgerSequence) {
    // console.log('Verifing Transaction');
    try {
        var currentLedgerVerison = await netAPI.getLedgerVersion();
    } catch (error) {
        Promise.reject(error);
    }

    try {
        var txResult = await netAPI.getTransaction(hash);
        // console.log('Final Result: ', txResult);

        // console.log('Final Result: ', txResult.outcome.result);
        // console.log('Validated in Ledger: ', txResult.outcome.ledgerVersion);
        // console.log('Sequence: ', txResult.sequence);

        return new Promise((resolve, reject) => {
            if (txResult.outcome.result === "tesSUCCESS") {
                if (txType == config.TX_TYPE.reward) {
                    resolve({
                        status: true,
                        code: txResult.outcome.result,
                        ledger: txResult.outcome.ledgerVersion,
                        from: txResult.specification.source.address,
                        to: txResult.specification.destination.address
                    });
                } else {
                    resolve({
                        status: true,
                        code: txResult.outcome.result,
                        ledger: txResult.outcome.ledgerVersion,
                        // from: txResult.specification.source.address,
                        // to: txResult.specification.destination.address
                    });
                }

            } else {
                resolve({
                    status: false,
                    code: txResult.outcome.result
                });
            }
        })
    } catch (error) {
        // console.log('Final error: ', error);

        /* If transaction not in latest validated ledger,
         try again until max ledger hit */
        if (error instanceof netAPI.errors.PendingLedgerVersionError ||
            error instanceof netAPI.errors.NotFoundError ||
            error instanceof netAPI.errors.MissingLedgerHistoryError) {
            if (currentLedgerVerison > lastLedgerSequence) {
                return Promise.resolve({
                    status: false,
                    code: "lastLedgerSequence hit"
                });
            } else {
                return new Promise((resolve, reject) => {
                    setTimeout(() => verifyTransaction(txType, netAPI, hash, lastLedgerSequence)
                        .then(resolve, reject), 1000);
                });
            }
        }
        return Promise.reject(error);
    }
}

module.exports = {
    doPaymentPrepareSign,
    doPaymentSubmit,
    verifyTransaction
};