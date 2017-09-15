import Ping from './Ping';
import Users from './Users';
import Root from './Root';
import SubscriptionProducts from './SubscriptionProducts';

import middleware_response from '../../middleware/response';

import ctx from '../../context';
let devLog = ctx.log('api_dev');

/**
 * ルーティング系の取りまとめ
 */
class Routes {

  constructor() {
    this.pureList = [
      new Ping()
    ];
    this.appList = [
      new Users(),
      new SubscriptionProducts()
    ];
  }

  addAll(router) {
    let exec = (r, validate) => {
      for (let key in r.uri) {
        let path = r.uri[key];
        devLog.info("api append route. path=%s, validate=%s", r.prefix + path, String(validate));
      }
      if (validate) {
        router.use(
          r.prefix,
          middleware_response.bindResponseHeader(),
          r.router()
        );
      } else {
        router.use(r.prefix, r.router());
      }
    };
    this.pureList.forEach((r) => {
      exec(r, false);
    });
    this.appList.forEach((r) => {
      exec(r, true);
    });
    // setting root
    let root = new Root()
    router.use('/', root.router())
    return router;
  }
}

export default new Routes();
