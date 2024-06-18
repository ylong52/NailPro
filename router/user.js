const express = require("express");
const router = express.Router();

// 导入用户路由处理函数对应的模块
const user_handler = require("../router_handler/user");

// 1. 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 2. 导入需要的验证规则对象
// const { reg_login_schema,update_avatar_imgtextsave } = require("../schema/user");

// 注册新用户
router.post("/reguser",   user_handler.regUser);
router.post("/info/:uuid", user_handler.userInfo);
// // 登录
// router.post("/login", expressJoi(reg_login_schema), user_handler.login);
// // 获取验证码
// router.get("/mobile/vcode", user_handler.mobilevcode);
//
// // 图片描述背景消息-查询
// router.post("/imgtext/getdata", user_handler.imgurltext);
//
// // 图片描述背景消息-更新
// router.post(
//   "/imgtext/upload",
//   expressJoi(update_avatar_imgtextsave),
//   user_handler.imgurltextsave
// );

module.exports = router;
