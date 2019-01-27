var MySQL = require('../mysql.js')
var express = require('express');
var Public = require('../public/javascripts/public')
var router = express.Router();

/* 添加文章 */
router.post('/addArticle', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
  let params = req.body
  if(!params.article_title || !params.article_desc || !params.article_content || !params.article_type) {
    Public.tips(res, 501, null, '请完善信息')
    return
  }
  let SQL = 'INSERT INTO article(article_title,article_desc,article_content,article_type,create_time,article_publish,browse_num) VALUES(?,?,?,?,?,?,?)'
  let insertParams = [params.article_title, params.article_desc, params.article_content, params.article_type, Date.now(),params.articlePublish ? 1 : 0, 0]
  MySQL.query(SQL,insertParams, function(err,result) {
    if (err) {
      Public.tips(res, 500, null, '新建失败，请联系管理员')
      return
    }
    Public.tips(res, 200, null, '新建成功') 
  })
})
/** 获取所有文章  模糊查询 分页 筛选 */
router.get('/getAllArticle', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
  let params = req.query
  if(!params.pageIndex || !params.type || !params.pageSize) {
    Public.tips(res, 501, null, '缺少参数')
    return
  }
  let SQL = 'select * from article where 1 = 1 '
  if (params.keyword) {
    SQL += ('and (article_title like "%' + params.keyword + '%" or article_desc like "%' + params.keyword + '%")')
  }
  if (params.type) {
    SQL += (' and article_type = "' + params.type + '"')
  }
  SQL += (' order by id desc limit ' + (params.pageIndex - 1) *  params.pageSize + ',' + params.pageSize)
  MySQL.query(SQL,null,function(err,result) {
    if (err) {
      Public.tips(res, 502, null, '获取失败')
      return
    }
    // 查询总条数
    let countSQL = 'select count(1) from article'
    MySQL.query(countSQL, null , function(error, countNum) {
      let sumData = countNum[0]['count(1)']
      let sumPage =  Math.ceil(sumData / params.pageSize)
      Public.tips(res, 200, {arr: result,totalPages: sumPage, totalNum: sumData}, '成功')
    })
  })
 
})
module.exports = router;
