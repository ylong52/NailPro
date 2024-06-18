// 导入生成 Token 的包
const jwt = require("jsonwebtoken");
// 导入全局的配置文件
const config = require("../config");
// 导入http模块
const http = require("http");
const querystring = require("querystring");
// 导入数据库操作模块
const db = require("../db/index");

// 处理JSON数据

const fs = require("fs");
const JSONStream = require("JSONStream");

const parseToken = (token) => {
  return jwt.verify(token, config.jwtSecretKey);
};

const getBeforeDate = (n) => {
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  s =
    year +
    "-" +
    (mon < 10 ? "0" + mon : mon) +
    "-" +
    (day < 10 ? "0" + day : day);
  return s;
};

//获取http信息
const getHttp = (data) => {
  console.log("data", data);
  return new Promise((resolve, reject) => {
    // 选项配置HTTP请求
    const options = {
      hostname: config.urlzg,
      port: 80,
      path: "/api/v2/scene/lists",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "client-id": data.clientId,
        Authorization: data.authorization,
      },
    };

    // 请求参数
    let postData = querystring.stringify(data.data);

    // 创建HTTP请求
    const req1 = http.request(options, (res) => {
      // console.log('res',res)
      const jsonStream = JSONStream.parse(res.data);

      // 处理解析到的每个对象
      jsonStream.on("data", (data) => {
        // console.log("打印数据", data);
        // 全部数据-最外层
        resolve(data);
      });

      jsonStream.on("error", (err) => {
        console.error(err.message);
      });

      // 将响应流管道到JSONStream
      res.pipe(jsonStream);
    });

    // 错误处理
    req1.on("error", (e) => {
      reject(e.message);
    });

    // 写入数据到请求主体
    req1.write(postData);

    // 结束请求
    req1.end();
  });
};

//获取http信息
const getHttps = (data) => {
  console.log("data", data);
  return new Promise((resolve, reject) => {
    // 选项配置HTTP请求
    const options = {
      hostname: config.urlzg,
      port: 80,
      path: "/api/v2/scene/getone",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "client-id": data.clientId,
        Authorization: data.authorization,
      },
    };

    // 请求参数
    let postData = querystring.stringify(data.data);

    // 创建HTTP请求
    const req1 = http.request(options, (res) => {
      // console.log('res',res)
      const jsonStream = JSONStream.parse(res.data);

      // 处理解析到的每个对象
      jsonStream.on("data", (data) => {
        // console.log("打印数据", data);
        // 全部数据-最外层
        resolve(data);
      });

      jsonStream.on("error", (err) => {
        console.error(err.message);
      });

      // 将响应流管道到JSONStream
      res.pipe(jsonStream);
    });

    // 错误处理
    req1.on("error", (e) => {
      reject(e.message);
    });

    // 写入数据到请求主体
    req1.write(postData);

    // 结束请求
    req1.end();
  });
};

// 获取-历史列表
const historylist = (data) => {
  return new Promise((resolve, reject) => {
    console.log("data", data);

    // 请求参数
    let postData = querystring.stringify({
      page: data.page,
      per_page: data.per_page,
      // 开始时间
      start_time: getBeforeDate(2),
      // start_time: `${new Date().getFullYear()}-${
      //   new Date().getMonth() + 1
      // }-${new Date().getDate()}`,
      // 结束时间
      end_time: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`,
    });

    console.log("postData", postData);

    // 配置项
    const options = {
      hostname: config.urlzg,
      port: 80,
      path: "/api/v2/scene/lists",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "client-id": data.clientid,
        Authorization: data.Authorization,
      },
    };

    // 发送请求
    const gethistorylist = http.request(options, (res) => {
      // console.log('res',res)
      // 使用JSONStream解析数据
      // 真正数据data-不然jsonStream.on会执行多次
      const jsonStream = JSONStream.parse(res.data);

      // 处理解析到的每个对象
      jsonStream.on("data", (data) => {
        // console.log("打印数据", data);
        // 全部数据-最外层
        resolve(data);
      });

      jsonStream.on("error", (err) => {
        console.error(err.message);
      });

      // 将响应流管道到JSONStream
      res.pipe(jsonStream);

      // res.on("data", (data) => {
      //   const list = Buffer.from(data).toString("utf8");
      //   // 输出在控制台
      //   // process.stdout.write(list);
      //   const getlist = JSON.parse(list);
      //   // console.log("测试", getlist);
      //   resolve(getlist);
      // });
    });

    // 错误处理
    gethistorylist.on("error", (err) => {
      reject(e.message);
    });

    // 写入数据到请求主体
    gethistorylist.write(postData);

    // 结束请求
    gethistorylist.end();
  });
};

// 获取-对话记录
const sessionlog = (data) => {
  return new Promise((resolve, reject) => {
    console.log("data", data);

    // 总数
    // var total = 0;
    var total = 10;
    var pageNo = 1;

    // 全局-用户id
    const userId = data;
    //   console.log("用户id", userId);

    // 构建分页语句
    // desc - 倒叙排列
    // asc  - 顺序排列
    const sql = `select * from chatlist where userId=? order by id asc limit ${total} offset ${
      (pageNo - 1) * total
    }`;

    db.query(sql, userId, (err, result) => {
      // console.log('err',err)
      // console.log('result',result)
      // 执行 SQL 语句失败
      if (err) reject(err.message);
      resolve(result);
    });

    // // 查询总条数sql
    // const sql = `select * from chatlist where userId=?`;

    // db.query(sql, userId, (err, result) => {
    //   // 执行 SQL 语句失败
    //   if (err) reject(err.message);

    //   // console.log("result", result);
    //   // console.log("result.length", result.length);

    //   // 总数
    //   total = result.length;

    // });
  });
};

// 获取-外部背景消息
const backimgpublic = () => {
  return new Promise((resolve, reject) => {
    let userId = 18;

    const sqlStr = "select * from imgback_text where userId=?";
    db.query(sqlStr, userId, (err, results) => {
      if (err) {
        console.log(err);
        reject({ backswtich: 0, backimgtext: "" });
        return;
      }
      if (results.length !== 1) {
        reject({ backswtich: 0, backimgtext: "" });
        console.log("获取图片背景消息失败！");
        return;
      }
      console.log("查询回来值", results);
      resolve(results[0]);
    });
  });
};

module.exports = {
  parseToken,
  getHttp,
  getHttps,
  historylist,
  sessionlog,
  backimgpublic,
};
