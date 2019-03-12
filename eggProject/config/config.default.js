/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551341406644_7034';

  // add your middleware config here
  config.middleware = [];
  // mysql相关配置
  config.mysql = {
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'root',
      // 数据库名
      database: 'expressbasedb',
    },
  };
  // token组件 定义一个全局的盐值
  config.jwt = {
    // secret: 'userkey',
    secret: '123456',
  };
  // 关闭csrftoken
  config.security = {
    csrf: {
      enable: false,
    },
  };


  config.multipart = {
    fileExtensions: [ '.doc' ],
  };

  // swagger配置
  config.swagger = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'egg-swagger',
      description: 'swagger-ui for egg',
      version: '1.0.0',
    },
    schemes: [ 'http', 'https' ],
    consumes: [ 'application/json' ],
    produces: [ 'application/json' ],
    securityDefinitions: {
      // apikey: {
      //   type: 'apiKey',
      //   name: 'clientkey',
      //   in: 'header',
      // },
      // oauth2: {
      //   type: 'oauth2',
      //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
      //   flow: 'password',
      //   scopes: {
      //     'write:access_token': 'write access_token',
      //     'read:access_token': 'read access_token',
      //   },
      // },
    },
    enableSecurity: false,
    // enableValidate: true,
    routerMap: false,
    enable: true,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    multipart: {
      fileSize: '20M',
    },

  };

  return {
    ...config,
    ...userConfig,
  };
};
