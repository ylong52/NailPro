const WebSocket = require("ws");
const url = require("url");

const chatai = require("./chatAi");
const db = require("./sqlTool");

// 导入数据库操作模块
const dbs = require("../db/index");

// 创建WebSocket服务器，监听端口3010
const wss = new WebSocket.Server({ port: 3010 });

// 存储所有连接
var connections = new Set();
// var connections = [];

// 历史记录
var userinfo = {};

// websocket连接-数组去重
const arrayUnique = (arr, name) => {
  // console.log("arr", arr);
  // console.log("name", name);
  let hash = {};
  return arr.reduce((acc, cru, index) => {
    if (!hash[cru[name]]) {
      hash[cru[name]] = {
        index: acc.length,
      };
      acc.push(cru);
    } else {
      acc.splice(hash[cru[name]]["index"], 1, cru);
    }
    // console.log("去重之后数据-执行次数", acc);
    return acc;
  }, []);
};

wss.on("connection", function connection(ws, req) {
  // 接收前端发来的userId
  const parameters = url.parse(req.url, true).query;
  const userId = parameters.userId;
  const userType = parameters.userType;

  connections.add({
    id: url.parse(req.url, true).query.userId,
    userType: userType,
    Instantiation: ws,
  });

  // if (url.parse(req.url, true).query.userType == 1) {
  //   connections.push({
  //     id: url.parse(req.url, true).query.userId,
  //     idtype: url.parse(req.url, true).query.userId + "userapp",
  //     Instantiation: ws,
  //   });

  //   // 去重
  //   connections = arrayUnique(
  //     connections,
  //     url.parse(req.url, true).query.userId + "userapp"
  //   );
  // } else {
  //   // connections.add({
  //   connections.push({
  //     id: url.parse(req.url, true).query.userId,
  //     idtype: url.parse(req.url, true).query.userId + "camapp",
  //     Instantiation: ws,
  //   });

  //   // 去重
  //   connections = arrayUnique(
  //     connections,
  //     url.parse(req.url, true).query.userId + "userapp"
  //   );
  // }

  // console.log(
  //   "ws连接",
  //   connections.map((v) => v.idtype)
  // );

  for (let value of connections.values()) {
    console.log("ws连接", value.id);
  }

  // 请求头信息
  // console.log("请求头信息", req.headers);
  // console.log("请求头信息", req.headers.authorization);
  // console.log("请求头信息", req.headers.clientid);
  userinfo.clientid = req.headers.clientid;
  userinfo.Authorization = req.headers.authorization;

  // console.log("parameters", parameters);
  // console.log("用户id", userId);
  console.log("用户端口来源(1-用户端/2-设备端)", userType);

  //匹配登录
  // db.matchQuery(matchQuerySql, userId, ws);

  console.log("客户端连接成功！");

  // userType == 1 代表用户端
  if (userType == 1) {
    // 发送前置条件
    // chatai.Ai("", ws, userId, 1, connections, userinfo, 1, "前置条件");
  }

  // 接收来自客户端的消息
  ws.on("message", function incoming(getMessage) {
    // console.log("所有连接", connections);

    console.log("客户端: %s", JSON.parse(getMessage));
    // console.log("客户端: %s", getMessage);
    // const clientMsg = Buffer.from(getMessage.msg, "hex");
    let data = JSON.parse(getMessage);

    const clientMsg = data.msg;
    console.log("data", data);
    console.log("clientMsg", clientMsg);

    // 断开websocket连接
    if (data.userType == 5 && userType == 1) {
      console.log("断开websocket连接");
      console.log("用户id-断开连接", data.moblieType);
      for (const connection of connections) {
        if (
          connection.id == data.moblieType &&
          connection.userType == userType
        ) {
          connection.Instantiation.close();
          connections.delete(connection);
        }
      }

      return;
    }

    // 设备端-同步
    if (userType == 2) {
      // // 存储到数据库
      // const sql = "insert into chatlist set ?";
      // dbs.query(
      //   sql,
      //   {
      //     judge: 0,
      //     msg: clientMsg,
      //     srcswitch: 0,
      //     src: "",
      //     userId,
      //   },
      //   (err, results) => {
      //     if (err) return console.log(err);
      //   }
      // );
      console.log("同步信息信息", clientMsg);
      // 连接通讯-设备端-用户端
      for (const connection of connections) {
        // console.log("所有连接", connection);
        // console.log("connection.id", connection.id);
        // console.log("userId", userId);
        if (connection.id == userId) {
          console.log("执行设备端-同步用户端");
          var objws = {
            webType: "3",
            msg: clientMsg,
          };

          // 同步到用户端
          connection.Instantiation.send(JSON.stringify(objws));
          //
          console.log("同步到用户端完毕");
        }
      }
    }

    // 图片识别userType == 4
    if (data.userType == 4) {
      // console.log("图片识别", data);
      // 存储数据库
      const sql = "insert into chatlist set ?";
      dbs.query(
        sql,
        {
          judge: clientMsg.judge,
          msg: clientMsg.msg || "",
          srcswitch: clientMsg.srcswitch,
          src: clientMsg.src || "",
          userId,
        },
        (err, results) => {
          if (err) return console.log(err)
        }
      );
      console.log("添加数据库完毕");

      // 图片识别
      // 图片文字模型数据(1-文字模型，2-实景模型，3-彩虹屁模)
      // 最后一个值图片识别内容
      if (data.moblie == 2) {
        chatai.Ai(
          clientMsg.src.toString("utf-8"),
          ws,
          userId,
          2,
          connections,
          userinfo,
          2,
          clientMsg.srctext
        );
      } else if (data.moblie == 3) {
        if (clientMsg.srctext) {
          const sql = "insert into chatlist set ?";
          dbs.query(
            sql,
            {
              judge: clientMsg.judge,
              msg: clientMsg.srctext || "",
              srcswitch: 0,
              src: "",
              userId,
            },
            (err, results) => {
              if (err) return res.cc(err);
            }
          );
          console.log("添加数据库完毕-AI描述");
        }
        chatai.Ai(
          clientMsg.src.toString("utf-8"),
          ws,
          userId,
          2,
          connections,
          userinfo,
          3,
          clientMsg.srctext
        );
        // 存储AI-描述
      }

      return;
    }
    console.log("执行-不是图片识别");

    // 1.向数据库插入客户端信息
    var insertIntoSql =
      "INSERT INTO chatlist (judge, msg, srcswitch, src, userId) VALUES (0, '" +
      clientMsg +
      "', 0, '','" +
      userId +
      "');";
    db.insertInto(insertIntoSql, (err, results) => {
      if (err) return res.cc(err);
      // userType == 2 代表设备端问题
      // console.log("clientMsg.userType == 2", data.userType == 2);
      // console.log("data.userType", data.userType);
    });

    // 2.向Ai提出问题
    chatai.Ai(
      clientMsg.toString("utf-8"),
      ws,
      userId,
      2,
      connections,
      userinfo,
      1
    );
  });

  // 当连接关闭时输出日志
  // ws.on("close", (err) => {
  //   console.log("关闭连接", err);
  // });
});
