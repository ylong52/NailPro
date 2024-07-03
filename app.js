// 导入 express
const express = require("express");
// 创建服务器的实例对象
const app = express();
const path = require('path');

const handlebars = require("express-handlebars");
// app.engine("handlebars", handlebars.engine({ defaultLayout: "layout" }));
// app.set("view engine", "handlebars");
//

app.engine('hbs', handlebars.engine({extname: 'hbs' }));
app.set('view engine', 'hbs');

// 设置一个静态文件夹，用于存放css和js文件
app.use(express.static("public"));

// 解析 JSON 请求体
app.use(express.json());

// 添加welcome路由
app.get("/", (req, res) => {
  res.render("welcome", { title: "欢迎" });
});

// 设置uploads目录为静态目录
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.get("/userinfo/:uuid", (req, res) => {
  res.render("userinfo", { uuid: req.params.uuid });
});



// 导入并使用用户路由模块
// const userRouter = require("./router/user");
app.use("/user", require("./router/user") );
// app.use("/user", require("./router/user") );




// // 添加用户注册的POST路由
// app.post("/user-reg", (req, res) => {
//   // 这里可以添加处理用户注册逻辑的代码
//   // 例如，从请求体中获取用户信息并保存到数据库
//   console.log("用户注册请求收到");
//
//   // 响应客户端
//   res.send("用户注册成功");
// });


// 启动服务器
app.listen(9010, () => {
  console.log("api server running at http://127.0.0.1:9010");
});
