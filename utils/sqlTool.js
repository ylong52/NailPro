const db = require("../db/index");


//插入数据库语句
const insertInto = (sentence, callback) => {
  db.query(sentence, function (error, results, fields) {

    if (error) throw error;
    callback(null, results);

  });
}

//匹配查询
const matchQuery = (sentence, userId, ws) => {
  db.query(sentence, function (error, results, fields) {
    
    // 查询结果
    if (userId == results[0]["id"]) {
      console.log("身份验证成功！");
    } else {
      console.log("身份验证失败-无法通讯！");
      ws.close();
    }

  });

}

module.exports = {
  insertInto,
  matchQuery,
};
