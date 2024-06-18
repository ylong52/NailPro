// 导入数据库操作模块
const db = require('../db/index')

//查询每周图形统计记录
exports.getEchart = (req, res) => {
    // 获取分页参数
    // console.log("req", req.query);
    const {  startDate, endDate } = req.query;
    // 全局-用户id
    const userId = req.userId;
    // console.log("用户id", userId);

    // 查询总条数sql
    sql = `select * from daily_schedule where userId=?`;

    db.query(sql, userId, (err, result) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);

        // console.log("result", result);
        // console.log("result.length", result.length);

        // 构建分页语句
        let sql = `select * from echart where userId=? and start_date=? and end_date=? `;

        db.query(sql, [userId,startDate,endDate], (err, result) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err);

            // console.log("分页", result);

            res.send({
                status: 200,
                message: "每周图形统计记录信息查询成功!",
                data: result,
            });
        });
    });
}