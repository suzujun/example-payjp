/**
 * validation error class
 *
 * バリデーションエラー
 */
export default class ValidationError {

  /*
   * コンストラクター
   */
  constructor(message) {
    this.err = new Error('failed to validation error, ' + message);
    this.err.data = {
      message: message
    };
    return this;
  }

  getMessage() {
    return this.err.data.message;
  }
}
