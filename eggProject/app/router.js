'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const checkToken = app.middleware.checkToken({}, app);
  router.get('/', controller.home.index);
  /** 用户模块  user */
  router.get('/user/getAll', checkToken, controller.user.getAll);
  router.get('/user/login', controller.user.userLogin);
  router.post('/user/signin', controller.user.signinUser);
  router.get('/article/getAllArticle', controller.article.getAll);
};
