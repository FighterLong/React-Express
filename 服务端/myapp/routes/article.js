var MySQL = require('../mysql.js')
var express = require('express');
var Public = require('../public/javascripts/public')
var router = express.Router();
var articleService = require('../service/articleService')

/* 添加文章 */
router.post('/addArticle', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
  let params = req.body
  if(!params.article_title || !params.article_desc || !params.article_content || !params.article_type) {
    Public.tips(res, 501, null, '请完善信息')
    return
  }
  articleService.addArticle(params).then(result => {
    Public.tips(res, 200, null, '新建成功') 
  }).catch(err => {
    Public.tips(res, 500, null, '新建失败，请联系管理员')
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
  articleService.getAllArticle(params).then(result => {
    Public.tips(res, 200, result, '成功')
  }).catch(err => {
    Public.tips(res, 500, null, '获取失败')
  })
})

/* 删除文章 通过用户ID以及文章ID删除对应的数据 */
router.post('/delArticle', function (req, res, next) {
  let params = req.body
  if (!params.uid) {
    Public.tips(res, 500, null, '请先登陆')
    return
  } else if (!params.ids || params.ids === '[]') {
    Public.tips(res, 500, null, '请选择你要删除的文章')
    return
  }
  if (params.ids.indexOf('[') !== -1) {
    params.ids = params.ids.slice(params.ids.indexOf('[') + 1, params.ids.indexOf(']'))
  }
  articleService.delArticle(params).then(res => {
    Public.tips(res, 200, null, '删除成功')
  }).catch(err => {
    Public.tips(res, 500, null, '删除失败')
  })
})

/** 获取用户自己的文章 */
router.get('/getMyArticle', function (req, res, next) {
  let params = req.query
  if (isNaN(params.uid)) {
    Public.tips(res, 500, null, '请先登陆')
    return
  }
  articleService.getMyArticle(params).then(res => {
    Public.tips(res, 200, result, '成功')
  }).catch(err => {
    Public.tips(res, 500, null, '获取失败')
  })
})

/** 通过文章ID获取详细信息 */
router.get('/getArticleMessage', function (req, res, next) {
  let params = req.query
  if (params.id) {
    Public.tips(res, 500, null, '请选择你要获取的文章')
    return
  }
  articleService.getArticleMessage(params).then(res => {
    Public.tips(res, 200, result, '成功')
  }).catch(err => {
    Public.tips(res, 500, null, '获取失败')
  })
})
/** 编辑文章 */
router.post('/updateArticle', function (req, res, next) {
  let params = req.body
  if (!params.article_id) {
    Public.tips(res, 501, null, '未找到此文章')
    return
  }
  if(!params.article_title || !params.article_desc || !params.article_content || !params.article_type) {
    Public.tips(res, 501, null, '请完善信息')
    return
  }
})

module.exports = router;
