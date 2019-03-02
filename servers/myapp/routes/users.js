var MySQL = require('../mysql.js')
var express = require('express')
var Public = require('../public/javascripts/public')
var TOKEN = require('../public/javascripts/token')
var router = express.Router()
/** *********************************** 登陆 *******************************************/
router.get('/login', function (req, res, next) {
  // res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
  let query = req.query
  for (var name in query) {
    if ((name === 'username' || name === 'password') && !query[name]) {
      Public.tips(res, 501, null, '账号密码为必填项')
      return
    }
  }
  // escape方法 用来防止node-mysql中的sql注入
  let sql = 'select * from userdata where username=? and password=?'
  var sqlParams = [query.username, query.password]
  MySQL.query(sql, sqlParams, (error, result) => {
    if (error) {
      console.log('err' + error)
      return
    }
    if (result && result.length) {
      // 注意登陆成功时  密码是不必要返回的
      delete result[0].password

      // 登陆成功时将token设置到客户端的cookie中  有效期至3天
      res.cookie('TOKEN', TOKEN.createToken(result[0]), {expires: new Date(Date.now() + (3 * 60 * 60 * 24))})

      // console.log(token.createToken(result[0]))
      let data = result[0]

      Public.tips(res, 200, data, '登陆成功')
    } else {
      Public.tips(res, 502, null, '账号密码不正确')
    }
  })
})

function setUser (res, params) {
  for (var name in params) {
    if ((name === 'username' || name === 'password' || name === 'email' || name === 'phone') && !params[name]) {
      Public.tips(res, 501, null, '请完善信息')
      return
    }
  }
  let insertSQL = 'INSERT INTO userdata(username,password,email,phone) VALUES(?,?,?,?)'
  // let insertParams = [MySQL.escape(params.username), MySQL.escape(params.password), MySQL.escape(params.email), MySQL.escape(params.phone)]
  let insertParams = [params.username, params.password, params.email, params.phone]
  MySQL.query(insertSQL, insertParams, (error, result) => {
    if (error) {
      console.log('err' + error)
      return
    }
    Public.tips(res, 200, null, '注册成功')
  })
}
/** *********************************** 注册 *******************************************/
router.post('/signin', function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
  let params = req.body
  let querySQL = `select * from userdata where username=?`
  var querySQLParams = [params.username]
  // MySQL.escape()
  MySQL.query(querySQL, querySQLParams, (err, result) => {
    if (err) {
      console.log('err:' + err)
      return
    }
    if (result && result.length) {
      Public.tips(res, 502, null, '账号已经被注册了')
    } else {
      setUser(res, params)
    }
  })
})
module.exports = router
