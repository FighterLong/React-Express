'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller user模块
 */
class UserController extends Controller {
  async getAll() {
    const a = await this.ctx.service.userService.getAllUser();
    this.ctx.body = a;
  }
  /**
   * @Router GET /user/login
   * @Request query string *username 用户名
   * @Request query string *password 密码
   * @Summary 用户登陆
   * @Description 用户登陆接口
   */
  async userLogin() {
    const { ctx, app } = this;
    const query = ctx.request.query;
    if (!query.username || !query.password) {
      ctx.response.body = { code: 500, msg: '账号密码为必填项', data: null };
    } else {
      // 查询结果
      const result = await ctx.service.userService.userLogin(query);
      if (result) {
        // 生成token
        const token = await app.jwt.sign(Object.assign({}, result), app.config.jwt.secret, { expiresIn: '3d' });
        // 将token设置到cookie
        ctx.cookies.set('TOKEN', token, { httpOnly: false, signed: false, maxAge: 3 * 24 * 3600 * 1000 });
        delete result.password;
        ctx.response.body = { code: 200, msg: '登陆成功', data: result };
      } else {
        ctx.response.body = { code: 500, msg: '账号密码错误', data: null };
      }
    }
  }
  /**
   * @Router POST /user/signin
   * @Request body siginUser
   * @Summary 用户注册
   * @Description 用户注册接口
   */
  async signinUser() {
    const { ctx } = this;
    ctx.response.body = { code: 500, msg: '账号密码错误', data: null };
  }
}
module.exports = UserController;
