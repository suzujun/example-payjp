import winston from 'winston';
import _ from 'underscore';
import Fluent from './Fluent';
winston.transports.Fluent = Fluent;

/**
 * ロギング
 */
class Logging {

  constructor() {
    this.format = {
      access: ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms x-frame-options{:res[x-frame-options]}',
    };
  }

  /**
   * Logger 初期化
   */
  setDefaultLevel(level) {
    winston.level = level || 'silly';
  }

  /**
   * transportを追加
   * @param options
   */
  add(options) {
    _.each(options, (values, name) => {
      winston.info('logging added transport. %s', name, values.targets);
      winston.loggers.add(name, values.transports);
      // winston の console 出力はデフォルトONのため、logger 設定したあとで削除する
      if (values.targets.console !== true) {
        let logger = winston.loggers.get(name);
        if (logger.transports.console) {
          logger.remove(winston.transports.Console);
        }
      }
    }, this);
  }

  /**
   * logger 取得
   * @param name
   * @returns {Logger}
   */
  get(name) {
    let logger = winston.loggers.get(name);
    if ((logger.transports.console && !logger.transports.console.label) ||
      (logger.transports.file && !logger.transports.file.label)){
      // config/logger 未設定のログはエラー
      throw new Error('failed to get undefined logger ' + name);
    }
    return logger;
  }

}

export default new Logging();
