var MySQL = require('../mysql.js')

var articleService = {
    // 添加文章
    addArticle(params) {
        let SQL = 'INSERT INTO article(article_title,article_desc,article_content,article_type,create_time,article_publish,browse_num) VALUES(?,?,?,?,?,?,?)'
        let insertParams = [params.article_title, params.article_desc, params.article_content, params.article_type, Date.now(),params.articlePublish ? 1 : 0, 0]
        return new Promise(function(resolve, reject) {
            MySQL.query(SQL,insertParams, function(err,result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }) 
        })
    },
    // 获取所有文章
    getAllArticle(params) {
        let SQL = 'select id,article_title,article_desc,create_time,browse_num from article where 1 = 1 '
        if (params.keyword) {
          SQL += ('and (article_title like "%' + params.keyword + '%" or article_desc like "%' + params.keyword + '%")')
        }
        if (params.type) {
          SQL += (' and article_type = "' + params.type + '"')
        }
        SQL += (' order by id desc limit ' + (params.pageIndex - 1) *  params.pageSize + ',' + params.pageSize)
        // select article_title,article_desc,create_time,browse_num from article where 1 = 1  and article_type = "react" order by id desc limit 0,10
        return new Promise(function(resolve, reject) {
            MySQL.query(SQL,null,function(err,result) {
                if (err) {
                    reject(err)
                } else {
                    // 查询总条数
                    let countSQL = 'select count(1) from article'
                    MySQL.query(countSQL, null , function(error, countNum) {
                      if (error) {
                        reject(error)
                      } else {
                        let sumData = countNum[0]['count(1)']
                        let sumPage =  Math.ceil(sumData / params.pageSize)
                        resolve({arr: result,totalPages: sumPage, totalNum: sumData})
                      }
                    })
                }
              })  
        })
    },
    // 删除指定文章
    delArticle(params) {
        let delSQL = 'delete from article where uid=' + params.uid + ' and id in (' + params.ids + ')'
        // 预期结果 del from article where uid=1 and id in(1) 或者 del from article where uid=1 and id in(1,2,3...)
        return new Promise(function(resolve, reject) {
            MySQL.query(delSQL, null, function(err,result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }) 
        })
    },
    // 获取用户自己的文章
    getMyArticle(params) {
        let querySQL = 'select * from article where uid=' + params.uid
        return new Promise(function(resolve, reject) {
            MySQL.query(delSQL, null, function(err,result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }) 
        })
    },
    // 获取文章详情
    getArticleMessage(params) {
        let querySQL = 'select * from article where id=' + params.id
        return new Promise(function(resolve, reject) {
            MySQL.query(querySQL, null, function(err,result) {
                if (err) {
                    reject(err)
                } else  if (!result) {
                    reject(err)
                } else {
                  // 查询到结果时  去修改其阅读量
                  let updateSQL = 'update article set browse_num = browse_num + 1 where id=' + params.id
                  MySQL.query(updateSQL, null,(error, data) => {
                    if (error) {
                      reject(error)
                    } else if( result.length ) {
                      resolve(result[0])
                    } else {
                      reject(error)
                    }
                  })
                }
                // Public.tips(res, 200, result, '成功')
                // Public.tips(res, 200, {arr: result,totalPages: sumPage, totalNum: sumData}, '删除成功')
            })
        })
    },
    // 修改文章
    updateArticle(params) {
      let updateSQL = 'UPDATE article SET article_title = ?,article_desc = ?,article_content = ?,article_type = ? WHERE Id = ? and uid = ?' 
      let updateParams = [params.article_title,params.article_desc,params.article_content,params.article_type,params.id,params.uid]
      return new Promise(function(resolve,reject) {
        MySQL.query(updateSQL,updateParams,function(err, result){
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    }
}
module.exports=exports=articleService;