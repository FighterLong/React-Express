var express = require('express')
var qs = require('querystring')
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',// 主机名
  port: 3306,// 端口
  database: 'expressbasedb',// 数据库名称
  user: 'root',
  password: 'root'
})
connection.connect(function(err) {
  if (err) {
    console.log('数据库连接失败：' + err)
  }
})
module.exports = connection
// {
//   connection: connection,
//   query: (sql) => {// 通过promise二次封装下query方法
//     if (!sql) { return }
//     return new Promise((resolve, reject) => {
//       connection.query(sql, (error, result) => {
//         console.log(result)
//         console.log(error)
//         if (result) {
//           resolve(result)
//         } else {
//           reject(error)
//         }
//       })
//     })
//   }
// }