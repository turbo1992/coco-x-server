var Koa = require('koa');
var path = require('path')
var bodyParser = require('koa-bodyparser');
const xmlParser = require('koa-xml-body')

// var session = require('koa-session-minimal');
// var MysqlStore = require('koa-mysql-session');
//配置文件
var config = require('./configs');
const moment = require('moment');

//response中间件
var response = require('./middlewares/response');

//try/catch中间件
var errorHandle = require('./middlewares/errorHandle');
var views = require('koa-views')
var koaStatic = require('koa-static')
var app = new Koa()
const router = require('./routes');
// const Sequelize = require('sequelize');



process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});

// // session存储配置
// const sessionMysqlConfig= {
//   user: config.database.USERNAME,
//   password: config.database.PASSWORD,
//   database: config.database.DATABASE,
//   host: config.database.HOST,
// }

// // 配置session中间件
// app.use(session({
//   key: 'USER_SID',
//   store: new MysqlStore(sessionMysqlConfig)
// }))


// 配置静态资源加载中间件
// app.use(koaStatic(
//   path.join(__dirname , './public/upload')
// ))

//输出请求的方法，url,和所花费的时间
app.use(async (ctx, next) => {
  let start = new Date();
  await next();
  let ms = new Date() - start;
  console.log(`${ ctx.method } ${ ctx.url }${ ctx.header } - ${ ms } ms`);
});
app.use(xmlParser());

app.use(bodyParser());


//使用response中间件(放在最前面)
app.use(response);

//使用errorHandle中间件
app.use(errorHandle);
//使用路由中间件
app.use(router.routes())
  .use(router.allowedMethods());

//监听端口
app.listen(config.app.port, () => {
  console.log('The server is running at http://localhost:' + config.app.port);
});

console.log(`listening on port ${config.app.port}`)
const log4js = require('log4js');
const logConfig = require("./configs/logConfig");
log4js.configure(logConfig.cocoLogConfig);



