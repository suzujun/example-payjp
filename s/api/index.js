import http from 'http';

import morgan from 'morgan';
import body_parser from 'body-parser';
import cookie_parser from 'cookie-parser';
import compression from 'compression';
//import method_override from 'method-override';
import express_validator from 'express-validator';

import express from 'express';
let router = express.Router();

import logging from '../logging';

import ctx from '../context';
let accessLog = ctx.log('api_access');
let devLog = ctx.log('api_dev');

import middleware_basic_auth from '../middleware/basicauth';
import middleware_cors from '../middleware/cors';
import routes from './routes';
import errors from '../errors';

const API_VERSION = '/v1';

/**
 * API Server
 */
class Api {

  constructor() {

    this.app = express();

    // BugSnag middleware to your app as the first middleware:

    this.app.disable('x-powered-by');
    this.app.set('trust proxy', true);
    this.app.use(body_parser.json({limit: '10mb'}));

    this.app.set('views', './s/views');
    this.app.set('view engine', 'jade');
    this.app.use('/s', express.static('public'));
    this.app.use(cookie_parser());

    // アクセスログ周り
    this.app.use(morgan(logging.format.access, {
      stream: {
        write: function (message) {
          accessLog.info(message);
        }
      }
    }));

    // Add the interceptor middleware
    /*this.app.set('json replacer', (key, value) => {
      return commonTransform.unicodeEscape(value);
    });*/

    // parse JSON error handlers
    this.app.use(function parseJsonError(err, req, res, next) {
      if (err instanceof SyntaxError) {
        devLog.warn('[Middleware] API Parse JSON error, err, [%s] %s', JSON.stringify(err), req.method, req.url);
        return next(errors.http.ParseJsonError());
      }
      next(err);
    });

    this.app.use(body_parser.urlencoded({extended: false}));

    // let basicAuth = null; //ctx.config.getApi().basicAuth;
    // if (basicAuth && basicAuth.use) {
    //   this.app.use(API_VERSION, middleware_basic_auth(basicAuth.username, basicAuth.password));
    // }


    // custom options (customValidators/customSanitizers/errorFormatter) @see https://github.com/ctavan/express-validator
    // this.app.use(express_validator());
    // this.app.use(compression());

    // setting cors
    this.app.use(middleware_cors.setCors())

    this.app.use('/', routes.addAll(router));

    // 404 Not Found 共通
    this.app.use(function notFound(req, res, next) {
      devLog.warn('[Middleware] API Not Found, [%s] %s', req.method, req.url);
      next(errors.http.NotFound());
    });

    // uri error handlers
    this.app.use(function uriError(err, req, res, next) {
      // URIError: Failed to decode param
      if (err instanceof URIError) {
        devLog.warn('[Middleware] API decode uri param error, [%s] %s', req.method, req.url);
        return next(errors.http.NotFound());
      }
      next(err);
    });

    // request entity too large error handlers
    this.app.use((err, req, res, next) => {
      if (err && err.status === 413) {
        devLog.warn("failed to request entity too large", JSON.stringify(err));
        return next(errors.http.RequestEntityTooLarge());
      }
      next(err);
    });

    // error handlers
    this.app.use(function internalServerError(err, req, res, next) {
      if (!err) {
        return next();
      }

      let data = err.data;
      if (!data) {
        data = errors.http.InternalServerError().data;
      }

      // エラーレベルに応じてログを出し分ける
      let platform = "unknown"; //commonPlatform.getPlatform(req);
      if (errors.isWarning(err)) {
        devLog.warn('[Middleware] API Error Handler, platform=[%s], [%s] %s', platform, req.method, req.url);
      } else {
        devLog.error('[Middleware] API Error Handler, platform=[%s], [%s] %s', platform, req.method, req.url);
        // if (ctx.config.isProduction()) {
        //   // 本番では bigquery に流し込むため、 stringify が必要
        //   devLog.error('error has occurred in the backend api. error=[%s], stack=[\n%s]', JSON.stringify(data), JSON.stringify(err.stack));
        // } else {
        devLog.error('error has occurred in the backend api. error=[%s], stack=[\n%s]', JSON.stringify(data), err.stack);
        // }
      }

      res.status(data.code).json(data);
    });
  }

  /**
   * 起動
   */
  start(callback) {
    let config = {port:3001,host:'0.0.0.0'} //ctx.config.getApi();
    this.server = http.createServer(this.app).listen(config.port, config.host, () => {
      devLog.info("Secure api server listening on port http://%s:%s", config.host, config.port);
      callback(null);
    });
  }
}

export default Api;
