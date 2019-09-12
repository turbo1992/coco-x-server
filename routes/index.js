const config = require('../configs'),
  Router = require('koa-router'),
  router = new Router({
    prefix: config.app.routerBaseApi
  }),
  public = require('../controllers/public')
  user = require('../controllers/user')
  food = require('../controllers/food')
  order = require('../controllers/order')

/* HTTP动词
    GET     //查询
    POST    //新建
    PUT     //替换
    PATCH   //更新部分属性
    DELETE  //删除指定ID的文档
*/

router
  .post('/v1/public/register', public.register) //用户注册
  .post('/v1/public/login', public.login) //用户登录
  .get('/v1/public/userInfo', public.userInfo) //查询用户信息
  .post('/v1/public/modifyPwd', public.modifyPwd) //修改密码
  .post('/v1/public/findPwd', public.findPwd) //找回密码

  .get('/v1/user/userList', user.userList) //查询用户列表

  .post('/v1/food/addFood', food.addFood) //添加餐品
  .get('/v1/food/foodList', food.foodList) //查询餐品列表
  .post('/v1/food/editFood', food.editFood) //编辑餐品信息
  .get('/v1/food/deleteFood', food.deleteFood) //删除餐品

  .post('/v1/order/submitOrder', order.submitOrder) //提交订单
  .get('/v1/order/delOrder', order.delOrder) //删除订单
  .get('/v1/order/orderList', order.orderList) //订单列表
  .get('/v1/order/orderStatistics', order.orderStatistics) //订单统计  

exports = module.exports = router;