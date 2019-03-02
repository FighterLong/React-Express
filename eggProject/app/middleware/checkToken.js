'use strict';
module.exports = (options, app) => {
  return async function(ctx, next) {
    console.log(ctx.request.header);
    const requestCookie = ctx.request.header.cookie;
    if (requestCookie) {
      let token = requestCookie.split(' ')[0];
      token = token.substr(token.indexOf('=') + 1);

      try {
        const decoded = app.jwt.verify(token, app.config.jwt.secret);
        console.log(decoded);

        delete decoded.exp;

        await next();
      } catch (error) {
        console.log(error);
        ctx.status = 401;
        ctx.body = {
          message: 'gsajhdghsadgsadsa',
        };

        return;
      }
      // app.jwt.verify(token, app.config.jwt.secret, function(e) {
      // console.log(e);
      // })
    } else {
      await next();
    }
  };
};
