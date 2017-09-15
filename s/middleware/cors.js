import _ from 'underscore';

import constant from '../constant';
//import ctx from '../context';
let allowDomains = {}//ctx.config.getApi().allowDomains;
let allowDomainLocal = {}//ctx.config.getApi().allowDomainLocal;

/**
 * Cross-Origin Resource Sharing middleware
 */
class Cors {

  constructor() {
  }

  /**
   * Set cors
   */
  setCors() {

    return (req, res, next) => {

      // 設定なしはすぐに抜ける
      if (_.isEmpty(allowDomains) && !allowDomainLocal) {
        return next()
      }

      let origin = req.header('Origin')
      let allowOrigin

      // ローカル許諾
      if (origin === 'null' && allowDomainLocal) {
        allowOrigin = "*"
      }
      // 許可ドメイン許諾
      else if (origin && !_.isEmpty(allowDomains)) {
        let matched = origin.match(/^(http:\/\/)(.*)/)
        let domain = matched && matched[2]
        if (_.contains(allowDomains, domain)){
          allowOrigin = origin
        }
      }

      // 許諾したドメインをヘッダーに設定
      if (allowOrigin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', [
          "Content-Type"
        ].join(', '));
        if (req.method === 'OPTIONS') {
          res.status(204).end()
        }
      }
      next()
    }
  }
}

export default new Cors();
