'use strict';
module.exports = {
  // 注册接口的入参配置
  siginUser: {
    username: { type: 'string', required: true, description: '用户名' },
    password: { type: 'string', required: true, description: '密码' },
    email: { type: 'string', required: true, description: '邮箱' },
    phone: { type: 'string', required: true, description: '手机号' },
  },
};
