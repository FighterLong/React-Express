'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller article模块
 */
class ArticleController extends Controller {
  /**
   * @Router GET /article/getAllArticle
   * @Request query string keyword 搜索关键字
   * @Request query string *type 文章类型
   * @Request query string *pageSize 每页数量
   * @Request query string *pageIndex 当前页
   * @Summary 查询所有文章
   * @Description 获取所有文章接口
   */
  async getAll() {
    const { ctx } = this;
    const query = ctx.request.query;
    if (!query.pageIndex || !query.type || !query.pageSize) {
      ctx.response.body = { code: 500, msg: '缺少必填参数', data: null };
    }
    const result = await this.ctx.service.articleService.getAll(query);
    ctx.response.body = { code: 200, msg: '查询成功', data: result };
  }
  async getArticleMessage() {
    const { ctx } = this;
    const query = ctx.request.query;
    if (!query.id) {
      ctx.response.body = { code: 500, msg: '未找到此文章', data: null };
    }
    const result = await this.ctx.service.articleService.getArticleMessage(query);
    ctx.response.body = { code: 200, msg: '查询成功', data: result };
  }
}
module.exports = ArticleController;
