const config = require('../configs');
// const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {
    // var session = ctx.session;
    // const { session } = ctx;
    // let n = ctx.session.views || 0;
    // ctx.session.views = ++n;
    // ctx.body = `${n} view(s)`;
    if (ctx.session.user) {
        await next();

    } else {
        ctx.session = null;
        ctx.throw(401, 'expired token');      //token验证失败
 
    }
};

