'use strict';

const matchRoute = function(route, req) {
  if (route.method) {
    return route.method === req.method && req.url.match(route.path);
  }
  return true;
};

class App {
  constructor() {
    this.routes = [];
  }

  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }

  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }

  use(handler) {
    this.routes.push({ handler });
  }

  connectionListener(req, res) {
    const matchedRoutes = this.routes.filter(route => matchRoute(route, req));
    const next = function() {
      const route = matchedRoutes.shift();
      route.handler(req, res, next);
    };
    next();
  }
}

module.exports = App;
