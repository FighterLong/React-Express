var crypto=require("crypto");
var client = require('./redis.js')
var token={
    createToken:function(obj,timeout){
        // console.log(parseInt(timeout)||0);
        var obj2={
            data:obj,//payload
            created:parseInt(Date.now()/1000),//token生成的时间的，单位秒
            exp:parseInt(timeout)||10000//token有效期
        };

        //payload信息
        var base64Str=Buffer.from(JSON.stringify(obj2),"utf8").toString("base64");

        //添加签名，防篡改
        var secret="hel.h-five.com";
        var hash=crypto.createHmac('sha256',secret);
            hash.update(base64Str);
        var signature=hash.digest('base64');

        
        // 将生成的token存入redis中 key为用户名
        client.set('sessionid:' + obj.username, base64Str+"."+signature)
        console.log('生成touken了')
        return  base64Str+"."+signature;
    },
    decodeToken:function(token){
        if (!token) {
            return ''
        }
        var decArr=token.split(".");
        if(decArr.length<2){
            //token不合法
            return false;
        }

        var payload={};
        //将payload json字符串 解析为对象
        try{
            payload=JSON.parse(Buffer.from(decArr[0],"base64").toString("utf8"));
        }catch(e){
            return false;
        }

        //检验签名
        var secret="hel.h-five.com";        
        var hash=crypto.createHmac('sha256',secret);
            hash.update(decArr[0]);
        var checkSignature=hash.digest('base64');

        return {
            payload:payload,
            signature:decArr[1],
            checkSignature:checkSignature
        }
    },
    checkToken:function(token, success, errorFunction){
        var resDecode=this.decodeToken(token);
        if(!resDecode){
            // reject()
            errorFunction()
            return
        }

        //是否过期
        var expState=(parseInt(Date.now()/1000)-parseInt(resDecode.payload.created))>parseInt(resDecode.payload.exp)?false:true;
        // 检测redis中所有的key的value 是否与token匹配
        client.keys('sessionid:*', function(err, keys) {
            if (err) {
                errorFunction()
                return
            }
            if (keys && keys.length) {
                client.mget(keys, function (error, res) {
                    if (error) {
                        errorFunction()
                        return
                    }
                    let isRedisToken = res.includes(token);
                    if(resDecode.signature===resDecode.checkSignature&&expState&&isRedisToken){
                        success()
                    } else {
                        errorFunction()
                        return
                    }
                })
            }
        })
    }
}
module.exports=exports=token;