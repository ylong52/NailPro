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
const path = require("path");
const multer = require('multer');
const formidable = require('formidable');
const {de} = require("yarn/lib/cli");
const fs = require('fs').promises;

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
        if (results.length>0) {
           resolve({'userInfo':results[0]});
        } else {
           userInfo = {}
           userInfo.user_id = 0
           resolve({'userInfo':userInfo});
        }


      });
    });
  };

  const saveUser = (userinfo) => {
    files = []
    for (const fileElement of userinfo.fileList) {
       files.push('\\'+fileElement['response'][0].path)
    }
    strfiles = files.join(";")
    return new Promise((resolve, reject) => {
      if (userinfo.id==0) {
        const uuid = generateUniqueCode();
        const created_at = new Date().toLocaleString();
        // 加密密码
        let sqlStr = "INSERT INTO users (`mobile_phone`,`realname`,`desc`,`images`,`weixing`,`uuid`,`created_at`) VALUES (?,?,?,?,?,?,?)";
        db.query(sqlStr, [userinfo.mobile_phone, userinfo.realname, userinfo.desc, strfiles,userinfo.weixing, uuid, created_at], (err, results) => {
          if (err) {
            console.log(err);
            resolve(-1);
          }
          // 插入成功后，resolve 方法可以返回新插入记录的 ID
          resolve(uuid);
        });
      } else {

        let sqlStr = "UPDATE `users` SET `realname`=?, `desc`=?,`images`=?,`weixing`=? WHERE  `user_id`=?";
        db.query(sqlStr, [userinfo.realname, userinfo.desc, strfiles, userinfo.weixing, userinfo.id], (err, results) => {
          if (err) {
            console.log(err);
            resolve(-1);
          }
          // 插入成功后，resolve 方法可以返回新插入记录的 ID
          resolve(userinfo.uuid);
        });

      }

    });
  };

  const storeUserData = async (userinfo) => {
    let userId = 0
    const userRet = await getUserInfo(userinfo);
    const isNumeric = /^\d+$/.test(userRet.userInfo.user_id);
    try {

      if (isNumeric) {
        userinfo.id = userRet.userInfo.user_id;
        userinfo.uuid = userRet.userInfo.uuid;
        if (userinfo.id>0) {
            userinfo.weixing = userRet.userInfo.weixing;
            userinfo.desc = userRet.userInfo.desc;
        } else {
          userinfo.weixing = userinfo.weixing;
          userinfo.desc = userinfo.desc;
        }


        return await saveUser(userinfo)
        // if (userId==0) {
        //   return await saveUser(userinfo)
        //
        // } else {
        //   return userIdRet.uuid;
        // }

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


// 设置multer存储配置
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      await fs.mkdir(path.join('uploads', currentDate), { recursive: true });
      cb(null, path.join('uploads',currentDate)); // 指定存储目录
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

//上传文件
exports.uploads = (req, res) => {
  // debugger;
  upload.array('file', 10)(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // 处理multer错误
      return res.status(500).send(err);
    } else if (err) {
      // 处理其他错误
      return res.status(500).send(err);
    }


    const files = req.files;
    console.log('Files:', files);
    // 这里可以处理文件和表单数据，例如保存到数据库
    res.send(files);

  });


}