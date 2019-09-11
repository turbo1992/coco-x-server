const fs = require('fs');

let config = {
    app: {
        port: process.env.API_PORT || 5111,
        routerBaseApi: '/api'
    },
    USER_TYPE: {
        user: 1,//用户
        admin: 2, //管理员
    },
    USER_STATE: {
        forbidden: -1,
        create: 0,
        activated: 1
    },
    RET_CODE: {
        success: 'success', //成功
        recordNotFound: 'recordNotFound', //查询记录未找到
        loginForbidden: 'loginForbidden', //禁止登陆
        paraErr: "paraErr", //参数错误
        signErr: "signErr", //签名错误
        authErr: "authErr", //权限不足
        pwdErr: 'pwdErr', //密码错误
        notActivate: 'notActivate', //未激活
        hasTrusted: 'hasTrusted', //已信任
        invitationCodeUsed: 'invitationCodeUsed', //已信任
        hadSigned: 'hadSigned', //用户已签到
        hadCertificated: 'hadCertificated', //用户已认证
        hadRegistered: 'hadRegistered', //用户已经被注册
        nameHadRegistered: 'nameHadRegistered', //用户已经被注册

        DBErr: 'DBErr', //查库异常
        smsErr: 'smsErr', //短信验证码错误
        smsSendErr: 'smsSendErr', //短信验证码发送错误
        smsSendLimit: 'smsSendLimit',//短信发送太频繁
        notAuditErr: 'notAuditErr', //未认证

        inviteCodeNotFount: 'inviteCodeNotFount', //邀请码不存在
        inviteCodeUsed: 'inviteCodeUsed',//邀请码已使用
        timestampErr: "timestampErr",//时间戳错误
    },
};

//可以新建一个private.js定义自己的私有配置
if (fs.existsSync(__dirname + '/private.js')) {
    config = Object.assign(config, require('./private.js'));
}

module.exports = config;