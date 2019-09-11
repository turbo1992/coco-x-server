var Sequelize = require('sequelize');
var config = require('../configs');


const Op = Sequelize.Op

// 创建数据库连接
var sequelize = new Sequelize(config.database.DATABASE, config.database.USERNAME, config.database.PASSWORD, {
    host: config.database.HOST,
    dialect: 'mysql',
    directory: false, // prevents the program from writing to disk
    port: config.database.PORT,
    additional: {
        timestamps: false
        //...
    },
    define: {
        timestamps: false
    },
    operatorsAliases: Op,
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    logging: false,
    pool: {
        max: 1000,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
// 数据库模型名称及lujing
const models = [{
        "name": "user",
        "path": "./user.js"
    },
    {
        "name": "food",
        "path": "./food.js"
    }
]

// 数据模型输出
models.forEach(item => {
    module.exports[item.name] = require(item.path)(sequelize, Sequelize)
})
module.exports.sequelize = sequelize