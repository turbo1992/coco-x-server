var Sequelize = require('sequelize');
var config = require('../configs');
var UserType = config.USER_TYPE;
const moment = require('moment');
var Utils = require('../Utils/Utils')
const Op = Sequelize.Op
var db = Utils.db;
var RetCode = config.RET_CODE;
const User = db.user;


class UserController {
    // 查询用户列表
    static async userList(ctx) {
        var {
            searchVal,
            state,
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
            if (state) {
                where.state = state
            }
            let order;
            order = [
                ["register_time", sort]
            ]
            if (startTime && endTime) {
                where.register_time = {
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
            var list = await User.findAndCountAll({
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
}

exports = module.exports = UserController;