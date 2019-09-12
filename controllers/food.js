var Sequelize = require('sequelize');
var config = require('../configs');
var UserType = config.USER_TYPE;
const moment = require('moment');
var Utils = require('../Utils/Utils')
const Op = Sequelize.Op
var db = Utils.db;
var RetCode = config.RET_CODE;
const User = db.user;
const Food = db.food;

class FoodController {
    //添加餐品
    static async addFood(ctx) {
        const {
            teleNum,
            name,
            price,
            stock,
            image_url,
            content,
            type
        } = ctx.request.body;
        console.log(ctx.request.body);

        try {
            let msg;
            if (Utils.strIsEmpty(teleNum)) {
                msg = "手机号不能为空!"
            }
            if (Utils.strIsEmpty(name)) {
                msg = "餐品名称不能为空!"
            }
            if (Utils.strIsEmpty(price)) {
                msg = "餐品价格不能为空!"
            }
            if (Utils.strIsEmpty(stock)) {
                msg = "餐品库存不能为空!"
            }
            if (Utils.strIsEmpty(image_url)) {
                msg = "餐品主图不能为空!"
            }
            if (Utils.strIsEmpty(type)) {
                msg = "餐品类型不能为空!"
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
            if (user) {
                if (user.state != UserType.admin) {
                    ctx.body = {
                        code: RetCode.authErr,
                        msg: "权限不足"
                    };
                    return;
                }
            } else {
                ctx.body = {
                    code: RetCode.recordNotFound,
                    msg: "用户不存在"
                };
                return;
            }

            var food;
            if (!Utils.strIsEmpty(name)) {
                var food = await Food.find({
                    where: {
                        name: name
                    }
                })
                if (food) {
                    ctx.body = {
                        code: RetCode.nameHadRegistered,
                        msg: "餐品名已被占用"
                    };
                    return;
                }
            }

            food = await Food.create({
                'name': name,
                'type': type,
                'price': price,
                'stock': stock,
                'image_url': image_url,
                'content': content,
                'create_time': moment(),
                'version': 1
            }).catch(err => {
                console.log(err);
            });

            await food.save();
            ctx.body = {
                code: RetCode.success,
                msg: '添加成功',
                data: food
            };
            return
        } catch (error) {
            console.log("DBErr", error);
            ctx.body = {
                code: RetCode.DBErr,
                msg: '添加失败',
                error
            };
        }
    }

    //编辑餐品信息
    static async editFood(ctx) {
        const {
            teleNum,
            foodId,
            name,
            price,
            stock,
            image_url,
            content,
            type
        } = ctx.request.body;
        try {
            let msg;
            if (Utils.strIsEmpty(teleNum)) {
                msg = "手机号不能为空!"
            }
            if (Utils.strIsEmpty(foodId)) {
                msg = "餐品id不能为空!"
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
            if (user) {
                if (user.state != UserType.admin) {
                    ctx.body = {
                        code: RetCode.authErr,
                        msg: "权限不足"
                    };
                    return;
                }
            } else {
                ctx.body = {
                    code: RetCode.recordNotFound,
                    msg: "用户不存在"
                };
                return;
            }

            var food = await Food.findOne({
                where: {
                    id: foodId
                }
            })
            if (!food) {
                ctx.body = {
                    code: RetCode.recordNotFound,
                    msg: "未找到餐品"
                };
                return;
            }
            if (name) {
                food.name = name;
            }
            if (price) {
                food.price = price;
            }
            if (stock) {
                food.stock = stock;
            }
            if (image_url) {
                food.image_url = image_url;
            }
            if (content) {
                food.content = content;
            }
            if (type) {
                food.type = type;
            }
            food.version = food.version * 1 + 1
            await food.save();
            ctx.body = {
                code: RetCode.success,
                msg: '修改成功',
                data: food
            };
            return
        } catch (error) {
            console.log("error", error);
            ctx.body = {
                code: RetCode.DBErr,
                msg: '修改失败',
                error
            };
        }
    }

    //删除餐品
    static async deleteFood(ctx) {
        const {
            teleNum,
            foodId,
        } = ctx.query;
        try {
            let msg;
            if (Utils.strIsEmpty(teleNum)) {
                msg = "手机号不能为空!"
            }
            if (Utils.strIsEmpty(foodId)) {
                msg = "餐品id不能为空!"
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
            if (user) {
                if (user.state != UserType.admin) {
                    ctx.body = {
                        code: RetCode.authErr,
                        msg: "权限不足"
                    };
                    return;
                }
            } else {
                ctx.body = {
                    code: RetCode.recordNotFound,
                    msg: "用户不存在"
                };
                return;
            }

            var food = await Food.find({
                where: {
                    id: foodId
                }
            })
            if (food) {
                await food.destroy();
            }
            ctx.body = {
                code: RetCode.success,
                msg: '删除成功',
                data: {}
            };
        } catch (error) {
            console.log(error)
            ctx.body = {
                code: RetCode.DBErr,
                msg: '删除失败',
                error
            };
        }
    }

    // 查询餐品列表
    static async foodList(ctx) {
        var {
            searchVal,
            type,
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
            if (type) {
                where.type = type
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
            var list = await Food.findAndCountAll({
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

exports = module.exports = FoodController;