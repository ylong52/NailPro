const mysql = require('mysql')

// const db = mysql.createPool({
//   host: '192.168.1.10',
//   user: 'user2',
//   password: '123456',
//   database: 'alchat',
// })

// 线上数据库
const db = mysql.createPool({
  host: '101.43.100.203',
  user: 'customer202406',
  password: '6TFZyWdRtHpTMHPd',
  database: 'customer202406',
})

module.exports = db
