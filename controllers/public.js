var Sequelize = require('sequelize');
var config = require('../configs');
var UserType = config.USER_TYPE;
const moment = require('moment');
var Utils = require('../Utils/Utils')
const Op = Sequelize.Op
var db = Utils.db;
var RetCode = config.RET_CODE;
const User = db.user;


class PublicController {
  // 用户注册
  static async register(ctx) {
    try {
      const {
        teleNum,
        password,
        username
      } = ctx.request.body;

      var msg;
      if (Utils.strIsEmpty(teleNum)) {
        msg = "手机号不能为空!"
      }
      if (Utils.strIsEmpty(password)) {
        msg = "密码不能为空!"
      }
      //console.log("params : ", teleNum, username, password);

      if (Utils.strIsEmpty(username)) {
        msg = "用户名不能为空!"
      }
      if (msg) {
        ctx.body = {
          code: RetCode.paraErr,
          msg: msg
        };
        return
      }

      var user = await User.find({
        where: {
          tele_num: teleNum,
        }
      })
      if (user) {
        ctx.body = {
          code: RetCode.hadRegistered,
          msg: "手机号已被占用"
        };
        return;
      }
      if (!Utils.strIsEmpty(username)) {
        var user = await User.find({
          where: {
            username: username
          }
        })
        if (user) {
          ctx.body = {
            code: RetCode.nameHadRegistered,
            msg: "用户名已被占用"
          };
          return;
        }
      }

      user = await User.create({
        'tele_num': teleNum,
        'password': password,
        'state': 1,
        'image_url': '',
        'username': username,
        'register_time': moment()
      })
      await user.save();

      ctx.body = {
        code: RetCode.success,
        msg: '注册提交成功'
      };
      return;

    } catch (error) {
      console.log('createDBerr', error);
      ctx.body = ({
        code: RetCode.DBErr,
        msg: '数据库操作失败',
        error
      })
      return;
    }
  }

  // 用户登录
  static async login(ctx) {
    var {
      teleNum,
      password
    } = ctx.request.body;

    try {
      if (Utils.strIsEmpty(teleNum)) {
        ctx.body = {
          code: RetCode.paraErr,
          msg: "手机号不能为空!",
        };
        return;
      }
      if (Utils.strIsEmpty(password)) {
        ctx.body = {
          code: RetCode.paraErr,
          msg: "密码不能为空!",
        };
        return;
      }

      var user = await Utils.User.find({
        where: {
          tele_num: teleNum
        }
      }).catch(error => {
        console.log(error);
        ctx.body = {
          code: RetCode.DBErr,
          msg: "数据查询错误",
          ex
        };
        return;
      })

      if (user) {
        if (user.password == password) {
          if (user.state == 1) {
            ctx.body = {
              code: RetCode.loginForbidden,
              msg: "用户被禁止登录"
            }
            return;
          }
          ctx.body = {
            code: RetCode.success,
            msg: "用户登录成功",
            data: {
              tele_num: user.tele_num,
              image_url: user.image_url,
              state: user.state,
              username: user.username,
              balance: user.balance,
              score: user.score
            }
          }
          return;
        } else {
          ctx.body = {
            code: RetCode.pwdErr,
            msg: "密码错误"
          }
          return;
        }
      } else {
        ctx.body = {
          code: RetCode.recordNotFound,
          msg: "用户不存在"
        };
      }
    } catch (error) {
      ctx.body = {
        code: RetCode.DBErr,
        msg: "登录异常"
      };
    }
  }

  // 查询用户信息
  static async userInfo(ctx) {
    var {
      teleNum,
    } = ctx.query;
    try {
      if (Utils.strIsEmpty(teleNum)) {
        ctx.body = {
          code: RetCode.paraErr,
          msg: "手机号不能为空!",
        };
        return;
      }
      var user = await User.find({
        where: {
          tele_num: teleNum
        }
      })
      if (user) {
        ctx.body = {
          code: RetCode.success,
          msg: "查询成功",
          data: {
            tele_num: user.tele_num,
            image_url: user.image_url,
            state: user.state,
            username: user.username,
            balance: user.balance,
            score: user.score
          }
        }
        return;
      } else {
        ctx.body = {
          code: RetCode.recordNotFound,
          msg: "未找到用户"
        };
        return;
      }
    } catch (error) {
      ctx.body = {
        code: RetCode.DBErr,
        msg: "查询用户失败",
        error
      };
    }
  }

  // 修改密码
  static async modifyPwd(ctx) {
    try {
      const {
        teleNum,
        oldPwd,
        newPwd,
        smsCode
      } = ctx.request.body;

      var msg;
      if (Utils.strIsEmpty(teleNum)) {
        msg = "手机号不能为空!"
      }
      if (Utils.strIsEmpty(oldPwd)) {
        msg = "旧密码不能为空!"
      }
      if (Utils.strIsEmpty(newPwd)) {
        msg = "新密码不能为空!"
      }
      if (Utils.strIsEmpty(smsCode)) {
        msg = "验证码不能为空!"
      }
      if (msg) {
        ctx.body = {
          code: RetCode.paraErr,
          msg: msg
        };
        return
      }
      var user = await User.find({
        where: {
          tele_num: teleNum
        }
      })
      if (!user) {
        console.log('NotGetUser');
        ctx.body = {
          code: RetCode.recordNotFound,
          msg: "未找到用户"
        };
        return;
      }

      if (user.password == oldPwd) {
        //只修改密码
        user.password = newPwd
        let newUser = await user.save();
        if (newUser) {
          ctx.body = {
            code: RetCode.success,
            msg: "修改密码成功"
          }
          return;
        } else {
          ctx.body = {
            code: RetCode.DBErr,
            msg: "数据库错误"
          }
          return;
        }
      } else {
        ctx.body = {
          code: RetCode.pwdErr,
          msg: "旧密码错误"
        };
        return;
      }
    } catch (error) {
      ctx.body = {
        code: RetCode.DBErr,
        msg: "数据库错误",
        error
      };
      return;
    }
  }

  // 找回密码
  static async findPwd(ctx) {
    try {
      const {
        teleNum,
        password
      } = ctx.request.body;

      var msg;
      if (Utils.strIsEmpty(teleNum)) {
        msg = "手机号不能为空!"
      }
      if (Utils.strIsEmpty(password)) {
        msg = "密码不能为空!"
      }
      if (msg) {
        ctx.body = {
          code: RetCode.paraErr,
          msg: msg
        };
        return
      }

      var user = await User.find({
        where: {
          tele_num: teleNum
        }
      })

      if (user) {
        user.password = password;
        await user.save();
        ctx.body = {
          code: RetCode.success,
          msg: '密码找回成功',
          data: {
            teleNum: user.tele_num
          }
        };
        return;
      } else {
        ctx.body = {
          code: RetCode.recordNotFound,
          msg: "未找到用户"
        };
        return;
      }
    } catch (error) {
      ctx.body = {
        code: RetCode.DBErr,
        msg: "数据库操作失败",
        error
      };
      return;
    }
  }
  
  // 生成随机数
  static async getRandomBytes(ctx) {
    const crypto = require('crypto');
    let res = crypto.randomBytes(12);
    ctx.body = {
      code: RetCode.success,
      msg: '随机数生成成功',
      data: {
        randomData: res
      }
    };
  }
}

exports = module.exports = PublicController;