const config = require('../configs');
// const jwt = require('jsonwebtoken');
// //返回一个token
// module.exports = (userId) => {
//     let privateKey = config.jwt.secret;
//     let expiresIn = config.jwt.exprisesIn;
//     const token = jwt.sign({
//             id: userId
//         }, privateKey, {
//             expiresIn
//         });
//     return token;
// };