// "use strict";
const moment = require('moment');

const config = require("../configs");
var db = require('../models/db')
const sequelize = db.sequelize;
var Utils = require('../Utils/Utils')

const User = db.user;
const txActivate = config.TX_TYPE.activate;
const txTrust = config.TX_TYPE.trust;
const txReward = config.TX_TYPE.reward;
const txPay = config.TX_TYPE.payGB;
const Order = db.orders;



function getRightDBField(dbObj) {
    let
        hashFieldName = "tx_hash",
        lastLedgerSeqFieldName = "last_sequence",
        typeFieldName = "tx_type",
        statusFieldName = "state"

    return {
        hash: hashFieldName,
        lastLSeq: lastLedgerSeqFieldName,
        txStatus: statusFieldName,
        type: typeFieldName
    }
}
//auto add refund_status when withdraw failed!!!
async function updateDBRecord(dbObj, hash, lastLedgerSeq, txStatus, txType, remark) {
    try {
        let dbFieldObj = getRightDBField(dbObj);
        remark = JSON.stringify(remark);
        var updateObj = {};
        if (hash !== "") {
            dbObj.item.tx_hash = hash;
        }
        if (lastLedgerSeq !== "") {
            dbObj.item.last_sequence = lastLedgerSeq;
        }
        if (txStatus !== "") {
            dbObj.item.state = txStatus;
            if (txStatus == config.OPT_STATUS.procFailureStatus && dbObj.db.name == "user_tx") {
                var userState;
                var user = await User.find({
                    where: {
                        id: dbObj.item.receiver_id
                    }
                })
                if (dbObj.item.tx_type == txActivate) {
                    if (user) {
                        await user.destroy();
                    }
                } else if (dbObj.item.tx_type == txTrust) {
                    if (user) {
                        user.state = config.USER_STATE.trustFail
                    }
                } else if (dbObj.item.tx_type == txReward) {
                    if (user.state != config.USER_STATE.invitationRewarded) {
                        user.state = config.USER_STATE.invitationRewardFail
                    }
                } else if (dbObj.item.tx_type == txPay) {
                    var userTx = dbObj.item;
                    var order = await Order.find({
                        where: {
                            id: userTx.order_id
                        }
                    })
                    var user = await User.find({
                        where: {
                            id: userTx.sender_id
                        }
                    })
                    if (order) {
                       order.state = config.ORDER_STATE.gbPayFail;
                       userTx.state = config.OPT_STATUS.procFailureStatus;
                       await order.save();
                       if(order.goods_id){
                        let s = `update goods set stock = stock + ${order.order_amount} where id = ${order.goods_id}`
                        await sequelize.query(s, { type: sequelize.QueryTypes.UPDATE })
                      }
                    }
                    await userTx.save();
                }
                if (user) {
                    await user.save()
                }
                // await dbObj.item.destroy();
            }
        }

        if (txType !== "") {
            dbObj.item.tx_type = txType;
        }
        if (remark !== "") {
            if (dbObj.item.hasOwnProperty("remark") && dbObj.item.remark !== "") {
                dbObj.item.remark = dbObj.item.remark + "  " + remark;
            } else {
                dbObj.item.remark = remark;
            }
        }
        if (updateObj === {}) {
            return nil;
        }
        let updateResult = await dbObj.item.save();
        // updateObj["updated"] = Date.now();
        // let updateResult = await dbObj.db.update(updateObj,
        //      {"where":{'id': dbObj.item.id }});

        return updateResult;
    } catch (error) {
        console.log('updateErr', error)
        return 'errr';
    }
}

module.exports = {
    getRightDBField,
    updateDBRecord
}