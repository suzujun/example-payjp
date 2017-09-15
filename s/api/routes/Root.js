import async from 'neo-async';
import Route from './Route';
import payjp from './../../external/payjp';

/**
 * User API (/User)
 */
class User extends Route {

  constructor() {
    super('/');
    this.uri = {
      root: ''
    }
  }

  router() {

    let _router = super.router();

    _router.route(this.uri.root)
      .get(this.root)
      .post(this.post());

    return _router;
  }

  root(req, res) {

    // [404]notfound
    if (req.originalUrl !== '/') {
      let url = "http://" + req.headers.host
      if (req.originalUrl.substr(0,1) === "/") {
        url += req.originalUrl
      } else {
        url += "/" + req.originalUrl
      }
      return res.render('notfound', {url});
    }
    // ----------------------------

    let userId = req.cookies.payjpUserId
    if (!userId) {
      return res.render('index'); // known user
    }

    // exist userId
    async.parallel([
      next => {
        payjp.getUser(userId, next)
      },
      next => {
        payjp.getPlans(100, 0, next)
      }
    ], (err, data) => {
      if (err) {
        return res.render('index', {error: err})
      }
      let resp = {
        user: data[0],
        products: data[1] && data[1].data || []
      }
      res.render('index', resp)
    })
  }

  post() {

    let self = this

    return (req, res, next) => {

      let resp = {}
      let userId = req.cookies.payjpUserId

      async.waterfall([
        next => {
          if (userId) {
            return payjp.getUser(userId, next)
          }
          self._registUser(req.body, next)
        },
        (user, next) => {
          resp.user = user
          if (!req.body.registSubscriptionId) {
            return next(null, null)
          }
          payjp.createUserSubscription(userId, req.body.registSubscriptionId, next)
        },
        (registed, next) => {
          payjp.getPlans(100, 0, next)
        },
        (products, next) => {
          resp.products = products || []
          next()
        }
      ], err => {
        let userId = resp.user && resp.user.id
        if (userId) {
          resp.registed = true
          res.cookie('payjpUserId', userId, {path: '/', httpOnly: true})
        } else {
          resp.error = err
        }
        res.render('index', resp);
      })
    }
  }

  _registUser(body, callback) {
    let data = {
      email: body.email,
      description: body.nickname,
      card: {
        number: body.cc_number,
        exp_month: body.cc_exp_month,
        exp_year: body.cc_exp_year,
        cvc: body.cc_cvc,
        name: body.cc_name
      }
    }
    payjp.createUser(data, callback)
  }
}

export default User;
