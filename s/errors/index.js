import NotFoundError from './NotFoundError';
import ValidationError from './ValidationError';

/**
 * HTTP Response Error
 *
 * @example
 * {
 *   'BadRequestParameter': { // わかりやすいキー名をつける
 *     id: '#C-0000-1111'
 *     code: 400, // HTTP Response Code
 *     message: 'xxxxxx' // Response Message
 *   }
 * }
 *
 * id フォーマット
 * - #    : 必ずつける
 * - C    : C=クライアント, S=サーバー, B=外部APIなどの外部要因
 * - 0000 : 機能別や用途別の大きい枠で連番をつける
 * - 1111 : エラー別の連番
 *
 */

/**
 * backend共通エラー
 */
class Errors {
  constructor() {
    let self = this;
    this.http = {
      /**
       * HTTPリクエストエラー全般に使用する。
       */
      'BadRequest':                function (message) {
        return self.wrapHttpError('#C-0000-0400', 400, 'BadRequest', message);
      },
      /**
       * 数量不足エラー
       * @param name 不足している項目名
       */
      'ShortageError':             function (name) {
        return self.wrapHttpError('#C-0001-0400', 400, 'BadRequest', `The number of ${name} is missing`);
      },
      /**
       * リクエスト文字列が上限を超えている
       */
      'LimitExceeded':             function () {
        return self.wrapHttpError('#C-0002-0400', 400, 'LimitExceeded')
      },
      /**
       * NGワードが含まれている
       */
      'ContainsNgWord':            function () {
        return self.wrapHttpError('#C-0003-0400', 400, 'Contains NG word')
      },
      /**
       * ステータス不一致
       */
      'UnmatchStatus':             function () {
        return self.wrapHttpError('#C-0004-0400', 400, 'Status does not match')
      },
      /**
       * 無効な provider token
       */
      'InvalidProviderToken':      function () {
        return self.wrapHttpError('#C-0005-0400', 400, 'Invalid provider token')
      },
      /**
       * 無効な json string
       */
      'ParseJsonError':            function () {
        return self.wrapHttpError('#C-0006-0400', 400, 'Parse JSON error')
      },
      /**
       * 期限切れエラー
       */
      'ExpiredError':              function () {
        return self.wrapHttpError('#C-0007-0400', 400, 'ExpiredError')
      },
      /**
       * CognitoとsyncされているはずのHash値が空
       */
      'HashRequired':              function () {
        return self.wrapHttpError('#C-0008-0400', 400, 'HashRequired')
      },
      /**
       * リスナーランキングが空であるエラー
       */
      'EmptyListenerRankingError': function () {
        return self.wrapHttpError('#C-0009-0400', 400, 'EmptyListenerRankingError')
      },
      /**
       * ツイートエラー
       */
      'TweetError': function () {
        return self.wrapHttpError('#C-0010-0400', 400, 'TweetError')
      },
      /**
       * UnAuthorized Error
       */
      'UnAuthorized':              function () {
        return self.wrapHttpError('#C-0000-0401', 401, 'UnAuthorized');
      },
      /**
       * パーミッションエラー全般に使用する。
       */
      'Forbidden':                 function () {
        return self.wrapHttpError('#C-0000-0403', 403, 'Forbidden');
      },
      /**
       * ブロックされている
       */
      'BlockedUser':               function () {
        return self.wrapHttpError('#C-0001-0403', 403, 'Blocked user')
      },
      /**
       * アカウントロックされている
       */
      'AccountLockedUser':         function () {
        return self.wrapHttpError('#C-0002-0403', 403, 'Account Locked user')
      },
      /**
       * 有料コーナー中に対しての禁止アクション
       */
      'RestrictedActionPayCorner': function () {
        return self.wrapHttpError('#C-0003-0403', 403, 'Restricted action during pay corner')
      },
      /**
       * 現在の放送中に送れるストックの上限を超えている（フィーバーギフト用）
       */
      'MaxStockCountExceeded':     function () {
        return self.wrapHttpError('#C-0004-0403', 403, 'Max stock count exceeded')
      },
      /**
       * Not Found
       */
      'NotFound':                  function (message) {
        return self.wrapHttpError('#C-0000-0404', 404, 'NotFound', message);
      },
      /**
       * Not Found (user)
       */
      'NotFoundUser':              function () {
        return self.wrapHttpError('#C-0001-0404', 404, 'NotFoundUser');
      },
      /**
       * Not Found (channel)
       */
      'NotFoundChannel':           function () {
        return self.wrapHttpError('#C-0002-0404', 404, 'NotFoundChannel');
      },
      /**
       * Not Found (stream)
       */
      'NotFoundStream':            function () {
        return self.wrapHttpError('#C-0003-0404', 404, 'NotFoundStream');
      },
      /**
       * Not Found (scene)
       */
      'NotFoundScene':             function () {
        return self.wrapHttpError('#C-0004-0404', 404, 'NotFoundScene');
      },
      /**
       * Not Found (gift)
       */
      'NotFoundGift':              function () {
        return self.wrapHttpError('#C-0005-0404', 404, 'NotFoundGift');
      },
      /**
       * Not Found (comment)
       */
      'NotFoundComment':           function () {
        return self.wrapHttpError('#C-0006-0404', 404, 'NotFoundComment');
      },
      /**
       * Not Found (corner)
       */
      'NotFoundCorner':            function () {
        return self.wrapHttpError('#C-0007-0404', 404, 'NotFoundCorner');
      },
      /**
       * Not Found (corner scene answer)
       */
      'NotFoundAnswer':            function () {
        return self.wrapHttpError('#C-0008-0404', 404, 'NotFoundAnswer');
      },
      /**
       * Not Found (stock gift)
       */
      'NotFoundStockGift':         function () {
        return self.wrapHttpError('#C-0009-0404', 404, 'NotFoundStockGift');
      },
      /**
       * Not Found (stock gift)
       */
      'NotFoundEvent':         function () {
        return self.wrapHttpError('#C-0010-0404', 404, 'NotFoundEvent');
      },
      /**
       * Data Conflict
       */
      'Conflict':                  function () {
        return self.wrapHttpError('#C-0000-0409', 409, 'DataConflict');
      },
      /**
       * アカウント Conflict エラー（連携しようとしたSNSアカウントは既に他ユーザで連携済）
       */
      "ConflictProviderAccount":   function () {
        return self.wrapHttpError('#C-0001-0409', 409, 'ConflictProviderAccount');
      },
      /**
       * Provider Conflict エラー（連携しようとしたSNSのドメインは既に連携済み)
       */
      'ConflictProviderDomain':    function () {
        return self.wrapHttpError('#C-0002-0409', 409, 'ConflictProviderDomain');
      },
      /**
       * Cognito Sync の Resource Conflict Error
       */
      'ConflictCognitoResource':   function () {
        return self.wrapHttpError('#C-0003-0409', 409, 'ConflictCognitoResource');
      },
      /**
       * 放送内で既に利用不可のフレームが送られた場合(1放送1つのみ)のエラー
       */
      'ConflictFeverFrame':        function () {
        return self.wrapHttpError('#C-0004-0409', 409, 'Frame is already used')
      },
      /**
       * 強制アップデートに使用する
       */
      'UpdateRequired':            function () {
        return self.wrapHttpError('#C-0000-0412', 412, 'UpdateRequired');
      },
      /**
       * メールアドレスの確認が取れていない
       */
      'EmailUnverified':           function () {
        return self.wrapHttpError('#C-0001-0412', 412, 'EmailUnverified');
      },
      /**
       * 退会
       */
      'Withdrawed':                function () {
        return self.wrapHttpError('#C-0002-0412', 412, 'Withdrawed');
      },
      /**
       * Request Bodyが大きすぎる
       */
      'RequestEntityTooLarge':     function () {
        return self.wrapHttpError('#C-0000-0413', 413, 'RequestEntityTooLarge');
      },
      /**
       * Uploadしようとした画像が、jpeg, png, gif以外
       */
      'UnsupportedMediaType':      function () {
        return self.wrapHttpError('#C-0000-0415', 415, 'UnsupportedMediaType');
      },
      /**
       * サーバーエラー全般に使用する。
       */
      'InternalServerError':       function () {
        return self.wrapHttpError('#S-0000-0500', 500, 'InternalServerError');
      },
      /**
       * 外部APIのエラー全般に使用する.
       */
      'InternalServiceError':      function () {
        return self.wrapHttpError('#B-0000-0500', 500, 'InternalServiceError');
      },
      /**
       * DB不特定時のエラー全般に使用する.
       */
      'DBUnspecified':             function () {
        return self.wrapHttpError('#B-0001-0500', 500, 'InternalServiceError');
      },
      /**
       * サーバーメンテナンス中に使用する。
       */
      'UnderMaintenance':          function () {
        return self.wrapHttpError('#S-0000-0503', 503, 'UnderMaintenance');
      }
    };
  }

  wrapHttpError(id, code, name, message) {
    if (!message) {
      message = name;
    }
    let err = new Error(message);

    err.data = {
      id:      id,
      code:    code,
      message: message
    };

    return err
  }

  /**
   * 警告エラーかどうか
   * @param err
   */
  isWarning(err) {
    let code = err && err.data && err.data.code || 0;
    return 400 <= code && code < 500;
  }

  /**
   * Error を backend 共通エラーに変換する
   * @param err Error Class
   * @returns {Error}
   */
  create(err) {
    // not found error
    if (err instanceof NotFoundError) {
      switch (err.data.name) { // name は必ず collection name となる
        case 'users':
          return this.http.NotFoundUser();
        case 'channels':
          return this.http.NotFoundChannel();
        case 'streams':
          return this.http.NotFoundStream();
        case 'm_gifts':
          return this.http.NotFoundGift();
        case 'comments':
          return this.http.NotFoundComment();
        default:
          return this.http.NotFound();
      }
    }
    else if (err instanceof ValidationError) {
      return this.http.BadRequest(err.message);
    }
    // other
    else {
      switch (err.status) {
        case 400:
          return this.http.BadRequest(err.message);
        case 401:
          return this.http.Unauthorized();
        case 403:
          return this.http.Forbidden();
        case 404:
          return this.http.NotFound();
        case 413:
          return this.http.RequestEntityTooLarge();
        default:
          return this.http.InternalServiceError();
      }
    }
  }

  /**
   * Errorを文字列に変換する
   * @param err Error Class
   * @param stack Stackを付加するか
   * @param line 1行で取得するか
   * @returns {string}
   */
  trace(err, stack = true, line = true) {
    let ret = "";
    if (err.data) {
      ret = 'id=' + err.data.id + ', code=' + err.data.code + ', message=' + err.data.message;
    } else {
      ret += err.toString();
    }

    if (stack) {
      if (line) {
        ret += ', stack=' + err.stack.split('\n').join(' ');
      } else {
        ret += '\n' + err.stack;
      }
    }

    return ret;
  }
}

export default new Errors();
