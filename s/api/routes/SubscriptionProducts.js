import Route from './Route';
import payjp from './../../external/payjp';

/**
 * User API (/User)
 */
class User extends Route {

  constructor() {
    super('/subscription_products');
    this.uri = {
      root: '',
      one:  '/:productId',
    }
  }

  router() {

    let _router = super.router();

    // _router
      //.all('*', middleware_session.validateSession())
      //.param('userId', middleware_user.setUser());

    _router.route(this.uri.root)
      .get(this.index)
      //.put(middleware_user.checkMyself(), this.updateUser)
      .options(super.options);

    _router.route(this.uri.one)
      .get(this.get)
      //.put(middleware_user.checkMyself(), this.updateUser)
      .options(super.options);

    return _router;
  }

  /**
   * ユーザー１件取得
   */
  index(req, res) {
    // return res.status(200).json({body:"body"});
    console.log(">>>subscription_products1")
    payjp.getSubscriptions().then((resp) => {
      console.log(">>>subscription_products2", resp)
      res.render('subscription_products', {products:resp.data});
    })
    .catch((err) => {
      console.error("subscription",err)
    })
  }

  /**
   * ユーザー１件取得
   */
  get(req, res) {
    // return res.status(200).json({body:"body"});
    res.render('index', { title: 'payjp - example', message: 'Hello there!'});
  }

  /**
   * ユーザー情報更新
   */
  updateUser(req, res, next) {
    res.status(204).end();
  }
}

export default User;
