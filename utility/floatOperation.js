"use strict"

const MAX_PRECISION = 16;

// 两个浮点数求和
function accAdd(num1, num2) {
    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m;
}

// 两个浮点数相减
function accSub(num1, num2) {
    var r1, r2, m, n;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
}
// 两数相除
function accDiv(num1, num2) {
    var t1, t2, r1, r2;
    try {
        t1 = num1.toString().split('.')[1].length;
    } catch (e) {
        t1 = 0;
    }
    try {
        t2 = num2.toString().split(".")[1].length;
    } catch (e) {
        t2 = 0;
    }
    r1 = Number(num1.toString().replace(".", ""));
    r2 = Number(num2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

function accMul(num1, num2) {
    var m = 0, s1 = num1.toString(), s2 = num2.toString();
    try { m += s1.split(".")[1].length } catch (e) { };
    try { m += s2.split(".")[1].length } catch (e) { };
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

function keepDecimal(number, decimalDigits) {
    return accDiv(Math.round(number * Math.pow(10, decimalDigits)), Math.pow(10, decimalDigits));
}

function assertValueIsValid(valueStr) {
    var headZeroPos;
    var pointPos = valueStr.indexOf('.');

    if (-1 === pointPos) {
        // Determine leading zeros.
        for (headZeroPos = 0; valueStr.charCodeAt(headZeroPos) === 48; headZeroPos++);
        valueStr = valueStr.slice(headZeroPos);
        var precision = valueStr.length;
        if (precision > MAX_PRECISION) {
            return null;
        }
        else return valueStr;
    }
    else {
        var len;
        // Determine leading zeros.
        for (headZeroPos = 0; (valueStr.charCodeAt(headZeroPos) === 48) && (headZeroPos < pointPos); headZeroPos++);
        // Determine trailing zeros.
        for (len = valueStr.length; (valueStr.charCodeAt(len - 1) === 48) && (len > pointPos); --len);
        var valueStrTemp = valueStr.slice(headZeroPos, len);
        var pointPosTemp = valueStrTemp.indexOf('.');
        if (0 === pointPosTemp) {
            if (parseFloat(valueStr) < 0.0000000000000001) {
                return null;
            }
            else if (valueStrTemp.length - 1 > MAX_PRECISION) {
                var newValue = "0" + valueStrTemp.slice(0, 17);
                return newValue;
            }
            else {
                var newValue = "0" + valueStrTemp;
                return newValue;
            }
        }
        else if ((valueStrTemp.length - 1) === pointPosTemp) {
            var precision = valueStrTemp.length - 1;
            if (precision > MAX_PRECISION) {
                return null;
            }
            else return valueStrTemp.slice(0, pointPosTemp);
        }
        else {
            var zLen = valueStrTemp.slice(0, pointPosTemp).length;
            var xLen = valueStrTemp.slice(pointPosTemp + 1).length;
            if (zLen > MAX_PRECISION) {
                return null;
            }
            else if ((zLen + xLen) < MAX_PRECISION) {
                return valueStrTemp;
            }
            else if ((zLen + xLen) > MAX_PRECISION) {
                var newValue = valueStrTemp.slice(0, 17);
                return newValue;
            }
        }
    }
}

module.exports = {
    accAdd,
    accSub,
    accDiv,
    accMul,
    keepDecimal,
    assertValueIsValid
};