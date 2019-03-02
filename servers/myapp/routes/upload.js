var fs = require('fs')
var express = require('express')
var Public = require('../public/javascripts/public')
var multer = require('multer')

var router = express.Router()

// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/upload_files') // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    cb(null, Date.now() + '-' + file.originalname)
  }
})

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })
// 单文件上传
router.post('/uploadFile', upload.any(), function (req, res, next) {
  res.writeHead(200, {'Content-Type': 'multipart/form-data; charset=utf-8'})
  // 记录上传的文件信息
  let fileInfo = req.files[0]
  console.log(req.files)
  let fileUrl = './upload_files/' + req.files[0].filename
  fs.readFile(fileInfo.path, function (err, data) {
    if (err) {
      console.log('文件读取失败：' + err)
    }
    fs.writeFile(fileUrl, data, function (error) {
      if (error) {
        console.log('文件储存失败：' + error)
      } else {
        Public.tips(res, 200, fileInfo, '上传成功')
      }
    })
  })
})

module.exports = router
