'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };
/** 启用插件 */
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
// token
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};
// swagger
exports.swaggerdoc = {
  enable: true,
  package: 'egg-swagger-doc',
};
// swagger
exports.multipart = {
  enable: true,
  package: 'egg-multipart',
};

