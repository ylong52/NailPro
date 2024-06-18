// 导入数据库操作模块
const db = require("../db/index");

// 首页-记录
exports.getincidentrecord = (req, res) => {
  // 获取分页参数
  // console.log("req", req.body);
  const { pageSize, pageNo } = req.body;

  // 总数
  var total = 0;

  // 全局-用户id
  const userId = req.userId;
  console.log("用户id", userId);

  // 查询总条数sql
  const sql = `select * from incident_record where userId=?`;

  db.query(sql, userId, (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err);

    // console.log("result", result);
    // console.log("result.length", result.length);

    // 总数
    total = result.length;

    // 构建分页语句
    const sql = `select * from incident_record where userId=? order by id desc limit ${pageSize} offset ${
      (pageNo - 1) * pageSize
    }`;

    db.query(sql, userId, (err, result) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err);

      // console.log("分页", result);

      res.send({
        status: 200,
        message: "查询成功",
        data: result,
        total,
      });
    });
  });
};
