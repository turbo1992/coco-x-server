var Sequelize = require('sequelize');
var config = require('../configs');
var UserType = config.USER_TYPE;
const moment = require('moment');
var Utils = require('../Utils/Utils')
const Op = Sequelize.Op
var db = Utils.db;
var RetCode = config.RET_CODE;
const User = db.user;
const Order = db.order;

class OrderController {
    // 提交订单
    static async submitOrder(ctx) {

    }

    // 删除订单
    static async delOrder(ctx) {
        
    }

    // 订单列表
    static async orderList(ctx) {
        
    }

    //订单统计
    static async orderStatistics(ctx) {
        
    }
}

exports = module.exports = OrderController;