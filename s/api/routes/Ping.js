import _ from 'underscore';
import async from 'neo-async';
import moment from 'moment';

import Route from './Route';
import errors from '../../errors';
import ctx from '../../context';
let devLog = ctx.log('api_dev');

let version = require('../../../package.json').version;

/**
 * Ping API (/ping)
 */
class Ping extends Route {

  constructor() {
    super('/ping');
    this.uri = {
      ping:     '',
      rev:      '/rev'
    }
  }

  router() {

    let _router = super.router();

    _router.route(this.uri.ping).get(this.get);
    _router.route(this.uri.rev).get(this.getRev);

    return _router;
  }

  get(req, res) {
    devLog.debug('ping api is called...');
    res.status(200).end('pong');

    // analyze app stats
    let {rss, heapTotal, heapUsed} = process.memoryUsage();

    // MB単位で出力
    let mb = 1024 * 1024;
    rss = rss && rss / mb || 0;
    heapTotal = heapTotal && heapTotal / mb || 0;
    heapUsed = heapUsed && heapUsed / mb || 0;

    devLog.info('memory.stats [MB]:', rss, heapTotal, heapUsed);
  }

  getRev(req, res) {
    devLog.debug('ping/rev api is called...');
    res.status(200).json({
      version:     version,
      commit:      rev.commit,
      updatedAt:   rev.updatedAt,
      updatedDate: moment(rev.updatedAt).format("YYYY-MM-DD HH:mm:ssZ")
    });
  }
}

export default Ping;
