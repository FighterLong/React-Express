// var redis = require('redis'),
// 	RDS_PORT = 6379,		//端口号
// 	RDS_HOST = '127.0.1.1',	//服务器IP
// 	RDS_OPTS = {},			//设置项
// 	client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
// client.on('ready',function(res){
// 	console.log('ready');	
// });
var redis = require('redis'),
    client = redis.createClient();
client.on('ready',function(res){
    console.log('Redis 连接成功！！！！');
});
client.on("error", function(error) {
    console.log('Redis 连接失败！！！！');
    console.log(error);
});
module.exports=exports=client;

