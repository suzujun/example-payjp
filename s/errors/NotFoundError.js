/**
 * not found error class
 * 
 * DBに検索対象が存在しないエラー
 */
export default class NotFoundError {

  /*
   * コンストラクタ
   */
  constructor(name, query) {
    this.err = new Error('not found the ' + name);
    this.err.data = {
      name:  name,
      query: query
    }
    return this;
  }

  toString() {
    let msg = this.err.message;
    if (this.err.data.query) {
      msg += ', ' + JSON.stringify(this.err.data.query);
    }
    return msg;
  }
}
