'use strict';

const Service = require('egg').Service;

class ArticleService extends Service {
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
}
module.exports = ArticleService;
