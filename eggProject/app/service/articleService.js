'use strict';

const Service = require('egg').Service;
class ArticleService extends Service {
  // 获取所有文章
  async getAll(params) {
    let SQL = 'select id,article_title,article_desc,create_time,browse_num from article where 1 = 1 ';
    if (params.keyword) {
      SQL += ('and (article_title like "%' + params.keyword + '%" or article_desc like "%' + params.keyword + '%")');
    }
    if (params.type) {
      SQL += (' and article_type = "' + params.type + '"');
    }
    SQL += (' order by id desc limit ' + (params.pageIndex - 1) * params.pageSize + ',' + params.pageSize);
    const result = await this.app.mysql.query(SQL);
    return result;
  }
  // 获取文章详情
  async getArticleMessage(params) {
    const result = await this.app.mysql.select('article', { id: params.id });
    return result;
  }
  // 删除文章
  async delArticle(params) {
    const Literal = this.app.mysql.literals.Literal;
    const result = await this.app.mysql.delete('article', { id: new Literal(`${params.ids}`) });
    return result;
  }
}
module.exports = ArticleService;
