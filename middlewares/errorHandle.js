// use: 统一错误处理中间件，用来统一捕获其他中间件的错误,在其他中间件使用之前使用 
const tracer = require('tracer');
const fs = require('fs');
//自定义错误输出格式
const logger = tracer.colorConsole({
    level: 'error',
    format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
	dateformat: "HH:MM:ss.L",
    transport: function(data){  //指定错误输出的文件，存到error.log下
        console.log(data.output);
        fs.appendFile('./error.log', data.output + '\n', { encoding: 'utf8'}, (err) => {
            if(err){
                throw err;
            };
        });
    }
});
module.exports = async (ctx, next) => {
    try{
        await next(); //一上面直接先执行下面的中间件
    }catch(err){
         //.stack为error对象的属性，返回错误或异常的代码跟踪信息
         //打印出来,并将错误继续向上抛出，如果只打印不继续抛出，相当于控制器抛出的错误在这里就停了, 也可以对错误进行一些操作后再输出
        logger.error(err.stack);
        throw(err);

        //对错误进行一些操作后再输出
        // if(!err){
        //     ctx.throw('未知错误!');
        // }
        // if(typeof(err) == 'string'){
        //     ctx.throw(new Error(err));
        // }
        //在控制器里面的抛出的错误最终会在这里被捕获。经过处理才正真输出
        // ctx.throw(400, 'name required');        ==================            如下
        // const err = new Error('name required');
        // err.status = 400;
        // err.expose = true;
        // throw err;
        // console.log('=============捕获的错误=============');
        // console.log(JSON.stringify(err));
        // ctx.throw(err.status, err.message);
        
    }
};

// module.exports = async (ctx, next) => {
//     try{
//         await next(); //一上面直接先执行下面的中间件
//     }catch(err){
//         if(!err){
//             return ctx.error({ msg: new Error('未知错误!') });
//         }
//         if(typeof(err) == 'string'){
//             return ctx.error({ msg: new Error(err) });
//         }
//         //.stack为error对象的属性，返回错误或异常的代码跟踪信息
//         logger.error(err.stack);
//         ctx.error({ msg: '服务器错误!', error: err, status: ctx.status });
//     }
// };