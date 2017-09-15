import Route from './Route';
import payjp from './../../external/payjp';

/**
 * User API (/User)
 */
class User extends Route {

  constructor() {
    super('/users');
    this.uri = {
      one: '/:userId',
      subscriptions: '/:userId/subscriptions'
    }
  }

  router() {

    let _router = super.router();

    // _router
      //.all('*', middleware_session.validateSession())
      //.param('userId', middleware_user.setUser());

    _router.route(this.uri.one)
      .get(this.get)
      .options(super.options);

    _router.route(this.uri.subscriptions)
      .post(this.postSubscriptions)
      .options(super.options);

    return _router;
  }

  get(req, res) {
    // return res.status(200).json({body:"body"});
    res.render('index', { title: 'payjp - example', message: 'Hello there!'});
  }

  postSubscriptions(req, res, next) {
    payjp.cpay
    res.redirect('/')
  }
}

export default User;
