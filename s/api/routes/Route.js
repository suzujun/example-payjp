import express from 'express';


/**
 * １つのルート抽象クラス
 */
export default class Route {
  constructor(prefix) {
    this._router = express.Router();
    this.prefix = prefix;
  }

  router() {
    return this._router;
  }

  process() {
    throw new Error("Use overrides the method.");
  }

  options(req, res) {
    res.status(200).end();
  }

}
