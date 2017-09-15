import _ from 'underscore';
import constant from '../constant';
import ctx from '../context';
let devLog = ctx.log('api_dev');

const PAYJP_TEST_PRIVATE_KEY = 'sk_test_6805b1098e70cfd0ea750009'
const PAYJP_TEST_PUBLIC_KEY = 'pk_test_3516ece64f0512811748a9fa'

/**
 * payjpクラス
 */
class Payjp {

  constructor() {
    this.payjp = require('payjp')(PAYJP_TEST_PRIVATE_KEY);
  }

  getSubscriptions(limit, offset, callback) {
    let option = {}
    if (limit) option.limit = limit
    if (offset) option.offset = offset
    this._response('getSubscriptions',
      this.payjp.subscriptions.list(option), callback)
  }

  getPlans(limit, offset, callback) {
    let option = {}
    if (limit) option.limit = limit
    if (offset) option.offset = offset
    this._response('getPlans',
        this.payjp.plans.list(option), callback)
  }

  createUserSubscription(userId, subscriptionId, callback) {
    let param = {
      customer: userId,
      plan: subscriptionId
    }
    this._response('createUserSubscription',
      this.payjp.subscriptions.create(param), callback)
  }

  createUser(user, callback) {
    this._response('createUser',
      this.payjp.customers.create(user), callback)
  }

  updateUser(userId, user, callback) {
    this._response('updateUser',
      this.payjp.customers.update(userId), callback)
  }

  getUser(userId, callback) {
    this._response('getUser',
      this.payjp.customers.retrieve(userId), callback)
  }

  _response(title, promise, callback) {
    promise
      .then(res => {
        devLog.info("[payjp]" + title, Date.now(), JSON.stringify(res))
        return callback(null, res)
      })
      .catch(err => {
        let {error} = err && err.response || {}
        devLog.error("[payjp]" + title, Date.now(), err.status, error)
        return callback(error)
      });
  }
}

export default new Payjp();
