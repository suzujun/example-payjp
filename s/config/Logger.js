import _ from 'underscore';
import constant from '../constant';

/**
 * 環境別ログ出力設定クラス
 */
class Logger {

  constructor(envName, mode) {

    this._logDirectory = '';
    this._logLevels = {};
    this._targetLogs = [];
    this._fileOption = {};
    this._fluentOption = {};

    //----------------------------------------
    // common settings
    //----------------------------------------

    switch (envName) {

      case constant.TEST:
      case constant.LOCAL:
        this._logDirectory = '/tmp';
        this._logLevels = {console: 'silly', file: 'silly'}; // fluent はレベル設定無し
        this._targetLogs = {console: true, file: false, fluent: false};
        this._fluentOption = {tag: 'local'};
        break;

      default:
        throw new Error('failed to setup logger, invalid env name');
    }
  }

  getConfig() {

    let loggers = {};

    //----------------------------------------
    // basic loggers
    //----------------------------------------

    this._intoConfig(loggers, 'system', '/common.log');
    this._intoConfig(loggers, 'purchase', '/purchase.log');
    this._intoConfig(loggers, 'tip_shortage', '/tip_shortage.log');

    //----------------------------------------
    // api loggers
    //----------------------------------------

    this._intoConfig(loggers, 'api_dev', '/api/dev.log');
    this._intoConfig(loggers, 'api_access', '/api/access.log');
    this._intoConfig(loggers, 'api_activity', '/api/activity.log', {console: false});

    return loggers;
  }

  _intoConfig(loggers, name, filepath, options = {}) {
    let transports = {};
    let {console, file, fluent} = options;
    let targets = {
      // options 設定優先で適用する
      console: _.isBoolean(console) ? console : this._targetLogs.console || false,
      file:    _.isBoolean(file) ? file : this._targetLogs.file || false,
      fluent:  _.isBoolean(fluent) ? fluent : this._targetLogs.fluent || false,
    };
    if (targets.console) {
      transports.console = this._generateConsoleConfig(name);
    }
    if (targets.file) {
      transports.file = this._generateFileConfig(name, filepath);
    }
    if (targets.fluent) {
      transports.fluent = this._generateFluentConfig(name, options);
    }
    loggers[name] = {
      transports: transports,
      targets:    targets
    };
  }

  _generateConsoleConfig(name) {
    return {
      label:       name,
      level:       this._logLevels.console || 'silly',
      json:        false,
      silent:      false,
      colorize:    true,
      timestamp:   true,
      showLevel:   true,
      prettyPrint: true,
    };
  }

  _generateFileConfig(name, filepath) {
    return {
      label:       name,
      level:       this._logLevels.file || 'silly',
      filename:    this._logDirectory + filepath,
      json:        false,
      silent:      false,
      colorize:    false,
      timestamp:   true,
      showLevel:   true,
      prettyPrint: true,
    };
  }

  _generateFluentConfig(name, options) {
    let {tag, host, port} = this._fluentOption;
    if (options && options.orion) {
      tag = 'orion';
    }
    return {
      tag:     tag,
      label:   name,
      host:    host || '127.0.0.1',
      port:    port || 24224,
      timeout: 3.0,
    };
  }
}

export default Logger;
