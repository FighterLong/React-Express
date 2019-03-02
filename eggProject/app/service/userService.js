'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getAllUser() {
    const user = await this.app.mysql.select('userdata');
    return user;
  }
  async userLogin(data) {
    const user = await this.app.mysql.get('userdata', { username: data.username, password: data.password });
    return user;
  }
}
module.exports = UserService;
