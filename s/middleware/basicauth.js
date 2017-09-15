import basic_auth from 'basic-auth-connect';

/**
 * Baisc 認証を要求する（ただし /ping を除く）
 *
 * @param _username
 * @param _password
 * @returns {Function}
 */
export default (_username, _password) => {

  let username = _username || "toredo";
  let password = _password || "toredo";
  let basicAuth = basic_auth(username, password);

  return (req, res, next) => {

    if (req.path.startsWith("/ping")) {
      return next();
    }

    basicAuth(req, res, next);
  };
};

