// 导入数据库操作模块
const db = require("../db/index");
// 导入 bcryptjs 这个包
const bcrypt = require("bcryptjs");
// 导入生成 Token 的包
const jwt = require("jsonwebtoken");
// 导入全局的配置文件
const config = require("../config");
// 导入http模块
const http = require("http");
// 处理get请求参数
const querystring = require("querystring");
const crypto = require('crypto');
// // 获取用户验证码
// exports.mobilevcode = (req, res) => {
//   // 获取验证码
//   const getlogin = {
//     hostname: config.urlzg,
//     path:
//       "/api/v2/mobile/vcode?" + querystring.stringify({ phone: "15220730439" }),
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//     },
//   };
//
//   const getloginresult = http.request(getlogin, (res) => {
//     // console.log("结果-验证码", res);
//   });
//
//   getloginresult.on("error", (e) => {
//     console.error(`请求失败: ${e.message}`);
//   });
//
//   res.send({
//     status: 200,
//     message: "获取验证码成功",
//     code: "",
//   });
// };

function generateUniqueCode() {
  // 获取当前时间戳
  const timestamp = new Date().getTime().toString(36); // 转换为36进制字符串

  // 生成4位随机数
  const random = crypto.randomBytes(2).toString('hex'); // 生成2字节随机数并转换为16进制字符串

  // 组合时间戳和随机数
  const uniqueCode = timestamp + random;

  return uniqueCode;
}


// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body;

  const getUserInfo = (userinfo) => {
    return new Promise((resolve, reject) => {
      let sqlStr = "select * from users where `mobile_phone`=?";
      db.query(sqlStr, userinfo.mobile_phone, (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
           resolve(results[0]);
        } else {
          resolve({'user_id':0});
        }
      });
    });
  };

  const saveUser = (userinfo) => {
    return new Promise((resolve, reject) => {

      const uuid = generateUniqueCode();
      const created_at = new Date().toLocaleString();
      // 加密密码
      let sqlStr = "INSERT INTO users (`mobile_phone`,`realname`,`desc`,`uuid`,`created_at`) VALUES (?,?,?,?,?)";
      db.query(sqlStr,[userinfo.mobile_phone, userinfo.realname, userinfo.desc,uuid,created_at],(err, results) => {
        if (err) {
          console.log(err);
          resolve(-1);

        }
        // 插入成功后，resolve 方法可以返回新插入记录的 ID
        resolve(uuid);
      });

    });
  };


  const storeUserData = async (userinfo) => {
    let userId = 0
    try {
      const userIdRet = await getUserInfo(userinfo);
      const isNumeric = /^\d+$/.test(userIdRet.user_id);
      if (isNumeric) {
        userId = userIdRet.user_id;
        if (userId==0) {
          return await saveUser(userinfo)

        } else {
          return userIdRet.uuid;
        }
      } else {
         console.log("用户ID是一个非数字字符串:", userId);
         throw new Error("系统错误")
      }
      console.log('用户ID:', userId);
    } catch (err) {
      console.log('查询错误:', err);
      return -1;
    }
  };

  storeUserData(userinfo).then(uuid=>{
    if (uuid.length==12) {
      res.send({
        status: 200,
        message: "注册成功",
        code: 0,
        data:{
          uuid:uuid
        }
      });
    } else {
      res.send({
        status: 200,
        message: "注册失败",
        code: 0,
        data:{}
      });
    }

  })

}


// 注册新用户的处理函数
exports.userInfo = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const uuid = req.params.uuid;
  const getUserInfo = (uuid) => {
    return new Promise((resolve, reject) => {
      let sqlStr = "select * from users where uuid=? limit 1";
      db.query(sqlStr, uuid, (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
           resolve(results[0]);
        } else {
          resolve(null);
        }
      })
    })
  };

  getUserInfo(uuid).then(r =>{

      res.send({
        status: 200,
        message: "获取用户信息成功",
        code: 0,
        data: {"userinfo":r}
      });

  })

}

