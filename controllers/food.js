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
            //console.log(food);
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

    }

    //删除餐品
    static async deleteFood(ctx) {

    }

    // 查询餐品列表
    static async foodList(ctx) {

    }
}

exports = module.exports = FoodController;