var Sequelize = require('sequelize');
var config = require('../configs');
var UserType = config.USER_TYPE;
var OrdrState = config.ORDER_STATE;
const moment = require('moment');
var Utils = require('../Utils/Utils')
const Op = Sequelize.Op
var db = Utils.db;
var RetCode = config.RET_CODE;
const User = db.user;
const Food = db.food;
const Order = db.order;
const OrderFood = db.order_food;

class OrderController {
    // 提交订单
    static async submitOrder(ctx) {
        const {
            teleNum,
            pay,
            type,
            foods
        } = ctx.request.body;
        console.log(ctx.request.body);

        try {
            let msg;
            if (Utils.strIsEmpty(teleNum)) {
                msg = "手机号不能为空!"
            }
            if (Utils.strIsEmpty(pay)) {
                msg = "支付金额不能为空!"
            }
            if (Utils.strIsEmpty(foods) || foods.length == 0) {
                msg = "订单内容不能为空!"
            }
            if (msg) {
                ctx.body = {
                    code: RetCode.paraErr,
                    msg: msg,
                };
                return;
            }

            var user = await User.find({
                where: {
                    tele_num: teleNum,
                }
            })
            if (!user) {
                ctx.body = {
                    code: RetCode.recordNotFound,
                    msg: "用户不存在"
                };
                return;
            }

            var order;
            order = await Order.create({
                'trade_num': 201909160001,
                'pay': pay,
                'type': type,
                'status': OrdrState.activated,
                'create_time': moment(),
                'user_id': user.id,
            }).catch(err => {
                console.log(err);
            });

            await order.save();

            for (let index = 0; index < foods.length; index++) {
                const food = foods[index];

                var searchFood = await Food.find({
                    where: {
                        id: food.id
                    }
                })
                if (!searchFood) {
                    ctx.body = {
                        code: RetCode.recordNotFound,
                        msg: "餐品不存在"
                    };
                    return;
                }

                var order_food;
                order_food = await OrderFood.create({
                    'order_id': order.id,
                    'food_id': searchFood.id,
                    'name': searchFood.name,
                    'image_url': searchFood.image_url,
                    'price': searchFood.price,
                    'amount': food.amount,
                    'type': type,
                    'status': OrdrState.activated,
                    'create_time': moment(),
                    'tele_num': user.tele_num
                }).catch(err => {
                    console.log(err);
                });

                await order_food.save();
            }
            
            ctx.body = {
                code: RetCode.success,
                msg: '订单提交成功',
                data: food
            };
            return
        } catch (error) {
            console.log("DBErr", error);
            ctx.body = {
                code: RetCode.DBErr,
                msg: '订单提交失败',
                error
            };
        }
    }

    // 删除订单
    static async delOrder(ctx) {
        const {
            teleNum,
            orderId,
        } = ctx.query;
        try {
            let msg;
            if (Utils.strIsEmpty(teleNum)) {
                msg = "手机号不能为空!"
            }
            if (Utils.strIsEmpty(orderId)) {
                msg = "订单id不能为空!"
            }
            if (msg) {
                ctx.body = {
                    code: RetCode.paraErr,
                    msg: msg,
                };
                return;
            }

            var user = await User.find({
                where: {
                    tele_num: teleNum,
                }
            })
            if (!user) {
                ctx.body = {
                    code: RetCode.recordNotFound,
                    msg: "用户不存在"
                };
                return;
            }

            var order = await Order.find({
                where: {
                    id: orderId
                }
            })
            if (!order) {
                ctx.body = {
                    code: RetCode.recordNotFound,
                    msg: "订单不存在"
                };
                return;
            }

            if (user.id == order.user_id) {
                await order.destroy();
                ctx.body = {
                    code: RetCode.success,
                    msg: '订单删除成功',
                    data: {}
                };
                return;
            } else {
                ctx.body = {
                    code: RetCode.DBErr,
                    msg: '订单删除失败',
                    data: {}
                };
                return;
            }
        } catch (error) {
            console.log(error)
            ctx.body = {
                code: RetCode.DBErr,
                msg: '订单删除失败',
                error
            };
        }
    }

    // 订单列表
    static async orderList(ctx) {
        var {
            searchVal,
            status,
            page,
            limit,
            startTime,
            endTime,
            isDesc
        } = ctx.query;

        let pageSize = page;
        let limitSize = limit;
        if (!pageSize) {
            pageSize = 1;
        }
        if (!limitSize) {
            limitSize = 10;
        }
        let offSet = limitSize * (pageSize - 1)

        let sort;
        if (isDesc == 1) {
            sort = "DESC";
        } else {
            sort = "ASC";
        }

        try {
            let where = {}
            if (status) {
                where.status = status
            }
            let order;
            order = [
                ["create_time", sort]
            ]
            if (startTime && endTime) {
                where.create_time = {
                    [Op.between]: [
                        startTime, endTime
                    ]
                }
            }
            let searchName;
            if (searchVal) {
                searchName = Utils.searchStr(searchVal);
                where.username = {
                    [Op.like]: '%' + searchName + '%'
                }
            }
            var list = await Order.findAndCountAll({
                where: where,
                offset: +offSet,
                limit: +limitSize,
                order: order
            })

            ctx.body = {
                code: RetCode.success,
                msg: "查询成功",
                data: list
            }
            return;

        } catch (error) {
            console.log(error);
            ctx.body = {
                code: RetCode.DBErr,
                msg: "查询异常"
            };
        }
    }

    //订单统计
    static async orderStatistics(ctx) {
        var {
            searchVal,
            status,
            page,
            limit,
            startTime,
            endTime,
            isDesc
        } = ctx.query;

        let pageSize = page;
        let limitSize = limit;
        if (!pageSize) {
            pageSize = 1;
        }
        if (!limitSize) {
            limitSize = 10;
        }
        let offSet = limitSize * (pageSize - 1)

        let sort;
        if (isDesc == 1) {
            sort = "DESC";
        } else {
            sort = "ASC";
        }

        try {
            let where = {}
            if (status) {
                where.status = status
            }
            let order;
            order = [
                ["create_time", sort]
            ]
            if (startTime && endTime) {
                where.create_time = {
                    [Op.between]: [
                        startTime, endTime
                    ]
                }
            }
            let searchName;
            if (searchVal) {
                searchName = Utils.searchStr(searchVal);
                where.username = {
                    [Op.like]: '%' + searchName + '%'
                }
            }

            var list = await Order.findAndCountAll({
                where: where,
                offset: +offSet,
                limit: +limitSize,
                order: order
            })
            if (list.rows) {
                var types = new Array();
                var totalPrice = 0;
                for (let index = 0; index < list.rows.length; index++) {
                    const item = list.rows[index];
                    var content = item.content;
                    var foods = new Array();
                    foods = content.split(";");
                    for (let j = 0; j < foods.length; j++) {
                        const food = foods[j];
                        var foodArr = new Array();
                        foodArr = food.split(":");
                        var foodName = foodArr[0];
                        var foodPrice = foodArr[1];
                        types.push(foodName);
                        totalPrice = totalPrice * 1 + foodPrice * 1;
                    }
                }
                //console.log('tag', types, totalPrice);
            }

            ctx.body = {
                code: RetCode.success,
                msg: "订单统计完成",
                data: {
                    foods: types,
                    amount: totalPrice
                }
            }
            return;

        } catch (error) {
            console.log(error);
            ctx.body = {
                code: RetCode.DBErr,
                msg: "查询异常"
            };
        }
    }
}

exports = module.exports = OrderController;