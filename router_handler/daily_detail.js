//导入公共模块getHttp
const { getHttps } = require("../utils/publicway");

//获取日常详情单条详情数据
exports.getDailyDetail = (req, res1) => {
  const { scene_id } = req.body;
  let data = {
    data: req.body,
    clientId: req.clientId,
    authorization: req.Tokenzg,
  };
  getHttps(data)
    .then((res2) => {
      console.log("res2", res2);
      res1.send(res2);
    })
    .catch((err) => {
      console.log(err);
    });
};
