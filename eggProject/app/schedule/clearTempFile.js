'use strict';
const fs = require('fs');
const Subscription = require('egg').Subscription;
class ClearTempFile extends Subscription {
  async clearFile() {
    await fs.unlink('/public/uploads/', err => {
      // 发生错误时将异常抛出
      if (err) throw err;
      console.log('删除成功');
    });
  }
}
module.exports = ClearTempFile;
