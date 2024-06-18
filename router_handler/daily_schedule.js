//导入公共模块getHttp
const { getHttp } = require("../utils/publicway");

//日常计划列表添加一条数据的处理函数
exports.addDailySchedule = (req, res) => {
  // console.log(req.headers.authorization)
  // // 要添加的数据
  // const dailySchedule = {
  // 	record_img: "http://i2.hdslb.com/bfs/archive/d2a003cbd92dfe3509871a13b04f3220ae10dba3.jpg",
  // 	record_time:  new Date().getTime(),
  // 	record_thing: "吃饭",
  // 	userId: "2",
  // 	record_date: new Date().getFullYear()+"-"+Number(new Date().getMonth()+1),
  // };
  // var url ="http://i2.hdslb.com/bfs/archive/d2a003cbd92dfe3509871a13b04f3220ae10dba3.jpg"
  // http.get(url, function (res) {
  // 	var chunks = [];
  // 	var size = 0;
  // 	res.on('data', function (chunk) {
  // 		chunks.push(chunk);
  // 		size += chunk.length;　　//累加缓冲数据的长度
  // 	});
  // 	res.on('end', function (err) {
  // 		var data = Buffer.concat(chunks, size);
  // 		var base64Img = data.toString('base64');
  // 		dailySchedule.record_img=base64Img
  // 		// console.log(`data:image/png;base64,${base64Img}`);
  // 	});
  // });
  // // 插入数据的SQL语句
  // const query = 'INSERT INTO daily_schedule SET ?';
  // // 执行插入操作
  // db.query(query, dailySchedule, (error, results, fields) => {
  // 	if (error) throw error;
  // 	// 日常计划列表插入成功
  // 	res.send({
  // 		status: 200,
  // 		message: "添加日常计划成功！",
  // 		data: dailySchedule
  // 	});
  // });
};

//日常计划列表查询25条或25条以上数据的处理函数
exports.getDailySchedule = (req, res1) => {
  // console.log("reqkjdfjdfhdkfhkjhpop[dfop[dof[pdofp[dofp[o[pfo[pdpo", req.body);

  let data = {
    data: req.body,
    clientId: req.clientId,
    authorization: req.Tokenzg,
  };
  getHttp(data)
    .then((res2) => {
      //   console.log("sdsdsdsdsdsds", res2);
      res1.send(res2);
    })
    .catch((err) => {
      console.log(err);
    });
};
