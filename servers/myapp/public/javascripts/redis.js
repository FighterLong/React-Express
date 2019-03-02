var redis = require('redis')
var client = redis.createClient()
client.on('ready', function (res) {
  console.log('Redis 连接成功！！！！')
})
client.on('error', function (error) {
  console.log('Redis 连接失败！！！！')
  console.log(error)
})
module.exports = exports = client
