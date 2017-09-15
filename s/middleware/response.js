/**
 * レスポンスに対しての middleware
 */
class App {

  /**
   * 脆弱性の指摘回避
   */
  bindResponseHeader() {

    return (req, res, next) => {

      // レスポンス内容に応じて Content-Type に従わない動作を禁止する
      res.set("X-Content-Type-Options", "nosniff");

      // ページキャッシュOFF
      res.set("Pragma", "no-cache");
      res.set("Cache-Control", "no-cache");

      next();
    }
  }

  /**
   * 外部で iframe 呼び出し禁止
   */
  bindIframeDenyResponse() {

    return (req, res, next) => {

      res.set("X-Frame-Options", "DENY");
      next();
    }
  }
}

export default new App();
