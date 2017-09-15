import path from 'path';
import async from 'neo-async';
import winston from 'winston';
import minimist from 'minimist';

//import config from '../config';
import Logger from '../config/Logger';
import logging from '../logging';
import constant from '../constant';

let packageVersion = require('../../package.json').version;
const StatsD = require('node-dogstatsd').StatsD;

/**
 * Sysutem Context
 */
class Context {

  constructor() {

    this._mode = this.getMode(); // 起動モード取得
    winston.info('MODE=%s', this._mode);

    // TODO 起動パラメータ CONSOLE の移行後に削除
    let console = !!process.env.CONSOLE;
    winston.info('CONSOLE=%s', console);
    this.console = console;
    if (console) {
      this._mode = constant.MODE_CONSOLE
    }

    // TODO 起動パラメータ WORKER の移行後に削除
    let worker = !!process.env.WORKER;
    winston.info('WORKER=%s', worker);
    this.worker = worker;
    if (worker) {
      this._mode = constant.MODE_WORKER
    }

    let env = process.env.ENV || constant.LOCAL;
    winston.info('ENV=%s', env);
    this.env = env; // システム環境情報
    //this.config = config.get(this.env);

    // logging 設定
    //let transports = config.getTransports(this.env, this._mode)
    let transports = new Logger(this.env, this._mode).getConfig();
    logging.add(transports);
    this.log = logging.get; // loggingへのショートカット

    this._db = null;
    this._aws = null;
    this._s3 = null;
    this._cache = null;
    this._orb = null;
    this._ctx = {
      // project home directory
      __homedir: path.normalize(__dirname + '/../..'),
      // env
      __env:     process.env.ENV || constant.LOCAL
    };

    let self = this;
    Object.defineProperty(this, "db", {
      get: function () {
        return self._db;
      },
      set: function (db) {
        self._db = db;
      }
    });

    Object.defineProperty(this, "cache", {
      get: function () {
        return self._cache;
      },
      set: function (cache) {
        self._cache = cache;
      }
    });
  }

  getMode() {
    let argv = minimist(process.argv.slice(2), {
      string:  ['mode'],
      alias:   {
        m: 'mode',
      },
      default: {
        mode: 'api',
      },
    });
    if (Array.isArray(argv.mode)) {
      // console.info("Usage: www [-m mode]");
      process.exit(1);
    }
    return argv.mode;
  }

  setup(callback) {
    let self = this;
    let tasks = [];

    // mongodb
    /*tasks.push((callback) => {
      this.log('system').info('mongodb setup');
      mongodb.setup(self.isModeApi(), (err) => {
        if (err) {
          return callback(err);
        }
        self._db = mongodb;
        callback();
      });
    });*/

    async.waterfall(tasks, (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  }

  close() {
    if (this.getDataDogStatsClient()) {
      this.getDataDogStatsClient().close();
    }
    mongodb.close();
  }

  refreshCache(callback) {
    cache.setup(err => {
      if (err) {
        return callback(err);
      }
      this._cache = cache;
      callback();
    });
  }

  /**
   * Home Directory 取得
   */
  getHomeDir() {
    return this._ctx.__homedir;
  }

  /**
   * EVN 取得
   */
  getEnv() {
    return this.env;
  }

  /**
   *  ローカル環境判定
   */
  isLocal() {
    return !!(!this.env || constant.LOCAL === this.env || constant.LOCAL_DOCKER === this.env);
  }

  /**
   * テスト環境判定
   */
  isTest() {
    return constant.TEST === this.env;
  }

  /**
   * 開発環境判定
   */
  isDevelop() {
    return constant.DEVELOP === this.env;
  }

  /**
   * STG環境判定
   */
  isStaging() {
    return constant.STAGING === this.env;
  }

  /**
   * 本番環境判定
   */
  isProduction() {
    return constant.PRODUCTION === this.env;
  }

  /**
   * Context 全体取得
   */
  get() {
    return this._ctx;
  }

  /**
   * Api context 取得
   */
  getApi() {
    return this.get().api;
  }

  isModeApi() {
    return this._mode === constant.MODE_API
  }

  isModeConsole() {
    return this._mode === constant.MODE_CONSOLE
  }

  isModeWorker() {
    return this._mode === constant.MODE_WORKER
  }

  isModeDemo() {
    return this._mode === constant.MODE_DEMO
  }
}

export default new Context();
