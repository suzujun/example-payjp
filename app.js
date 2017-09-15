import winston from 'winston';
import async from 'neo-async';

import ctx from './s/context';

/**
 * Application Manager
 */
class ApplicationManager {

  constructor() {
    this.apps = {};
  }

  /**
   * 各種サービスを起動
   */
  start() {
    let self = this;
    ctx.setup((err) => {
      if (err) {
        winston.error('context load error', err);
        throw err;
      }

      winston.info("Mode: ", ctx.mode);

      ////
      // API
        async.waterfall([
          (callback) => {
            let Api = require('./s/api').default // ここでのみ利用するため require でここに記述
            self.apps.api = new Api();
            self.apps.api.start((err) => {
              if (err) {
                return callback(err);
              }
              winston.info("API start success.");
              callback();
            });
          }
        ], (err) => {
          if (err) {
            winston.info("Application start error.", err);
            throw err;
          }
          winston.info("Application start success.");
        });
    });
  }
}

module.exports = new ApplicationManager();

// Exit Code: https://nodejs.org/api/process.html#process_exit_codes
process.on('exit', () => {
  // close mongodb etc...
  ctx.close();
});
