
const config = require('../configs');
const db = require('../models/db');

var RetCode = config.RET_CODE;
const User = db.user;


function checkTimestamp(timestamp, ctx) {
  if (strIsEmpty(timestamp)) {
    ctx.body = {
      code: RetCode.timestampErr,
      msg: "timestamp error"
    };
    return false;
  }
  var nowDateSec = Date.now();
  var timestampReq = parseInt(timestamp);

  return true;
}

function strIsEmpty(str) {
  if (str == "" || (str == null && str != "0") || typeof (str) == "undefined") {
    return true;
  } else {
    return false;
  }
}

function stringToBytes(str) {
  var ch, st, re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char  
    st = []; // set up "stack"  
    do {
      st.push(ch & 0xFF); // push byte to stack  
      ch = ch >> 8; // shift value down by 1 byte  
    }
    while (ch);
    // add stack contents to result  
    // done because chars have "wrong" endianness  
    re = re.concat(st.reverse());
  }
  // return an array of bytes  
  return re;
}

function createSMSCode() {
  var code = "";
  var codeLength = 6;
  var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
  for (var i = 0; i < codeLength; i++) {
    var charIndex = Math.floor(Math.random() * 10);
    code += selectChar[charIndex];
  }
  return code;
}


async function createInviteCode() {
  var code = "";
  var codeLength = 8;
  var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
  for (var i = 0; i < codeLength; i++) {
    var charIndex = Math.floor(Math.random() * 34);
    code += selectChar[charIndex];
  }

  var Ncode = await InviteCode.find({
    where: {
      code: code
    }
  })
  if (!Ncode) {
    return code;
  } else {
    await this.createInviteCode();
  }
}

//获得某周的开始日期　　 
function getWeekStartDate(paraYear, paraMonth, paraDay, paraDayOfWeek) {
  var weekStartDate = new Date(paraYear, paraMonth, paraDay + 1 - paraDayOfWeek);
  return formatDate(weekStartDate);
}

//解码客户端提交的交易blob，返回相应的json
function searchStr(searchVal) {
  let searchStr = searchVal.replace(/%/g, '\\%')
  searchStr = searchStr.replace(/_/g, '\\_')
  searchStr = searchStr.replace(/'/g, "\\'")
  return searchStr;
}

module.exports = {
  User,
  db,
  stringToBytes,
  strIsEmpty,
  checkTimestamp,
  getWeekStartDate,
  searchStr
}