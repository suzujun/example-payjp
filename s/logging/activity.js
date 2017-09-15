import _ from 'underscore';
import moment from 'moment';

import ctx from '../context';
//import commonPlatform from '../common/platform';

/**
 * Activity ロギング
 * - loggingData.messageは、fluent.jsで上書くため使わない
 * @see {@link Fluent}
 */
class Activity {

  // reqが無いパターンもあるため、userIdは別途指定
  constructor() {
    this.apiLogger = ctx.log('api_activity');
    this.purchaseLogger = ctx.log('purchase');
    this.appealLogger = ctx.log('appeal_activity');
    this.consoleLogger = ctx.log('console_activity');
    this.workerLogger = ctx.log('worker_activity');
    this.tipShortageLogger = ctx.log('tip_shortage'); // チップ不足ログ
  }

  /**
   * create record
   * @param req
   * @param loginUserId
   * @param typeName
   * @returns {Activity}
   */
  create(req, loginUserId, typeName) {
    let now = Date.now();
    let m = moment(now);

    this.loggingData = {
      typeName:   typeName,
      date:       m.format(),
      dateMillis: now,
      userId:     loginUserId
    };

    // required
    if (req) {
      this.loggingData.ip = !_.isEmpty(req.ips) ? req.ips : req.ip;
      this.loggingData.method = req.method;
      this.loggingData.uri = req.url;
      this.loggingData.referer = req.header('referer');
      this.loggingData.httpVersion = req.httpVersion;
      this.loggingData.userAgent = req.header('user-agent');
      //this.loggingData.platform = commonPlatform.getPlatform(req);
    }
    return this;
  }

  /**
   * JASRACコード
   * @param val
   * @returns {Activity}
   */
  code(val) {
    let self = this;
    self.loggingData.code = val;
    return this;
  }

  /**
   * ログインAuth情報
   * @param val
   * @returns {Activity}
   */
  auth(val) {
    let self = this;
    self.loggingData.auth = val;
    return this;
  }

  /**
   * ログインProvider情報
   * @param val
   * @returns {Activity}
   */
  provider(val) {
    let self = this;
    self.loggingData.provider = val;
    return this;
  }

  /**
   * 初回ログインフラグ
   * @param val
   * @returns {Activity}
   */
  firstAuthorized(val) {
    let self = this;
    self.loggingData.firstAuthorized = val;
    return this;
  }

  /**
   * Role
   * @param val
   * @returns {Activity}
   */
  role(val) {
    let self = this;
    self.loggingData.role = val;
    return this;
  }

  /**
   * 通報種別
   * @param val
   * @returns {Activity}
   */
  reportType(val) {
    let self = this;
    self.loggingData.reportType = val;
    return this;
  }

  /**
   * TargetUserId
   * @param val
   * @returns {Activity}
   */
  targetUserId(val) {
    let self = this;
    self.loggingData.targetUserId = val;
    return this;
  }

  /**
   * ChannelId
   * @param val
   * @returns {Activity}
   */
  channelId(val) {
    let self = this;
    self.loggingData.channelId = val;
    return this;
  }

  /**
   * StreamId
   * @param val
   * @returns {Activity}
   */
  streamId(val) {
    let self = this;
    self.loggingData.streamId = val;
    return this;
  }

  /**
   * CommentId
   * @param val
   * @returns {Activity}
   */
  commentId(val) {
    let self = this;
    self.loggingData.commentId = val;
    return this;
  }

  /**
   * アップロード画像URL
   * @param val
   * @returns {Activity}
   */
  imageUrl(val) {
    let self = this;
    self.loggingData.imageUrl = val;
    return this;
  }

  /**
   * NGワード
   * @param val
   * @returns {Activity}
   */
  ngWord(val) {
    let self = this;
    self.loggingData.ngWord = val;
    return this;
  }

  /**
   * コメント内容
   * @param val
   * @returns {Activity}
   */
  comment(val) {
    let self = this;
    self.loggingData.comment = val;
    return this;
  }

  /**
   * 対象となるTwitterのuserId
   * @param val
   * @returns {Activity}
   */
  targetTwitterUserId(val) {
    let self = this;
    self.loggingData.targetTwitterUserId = val;
    return this;
  }

  /**
   * TwitterのtweetId
   * @param val
   * @returns {Activity}
   */
  tweetId(val) {
    let self = this;
    self.loggingData.tweetId = val;
    return this;
  }

  /**
   * TwitterのtweetText
   * @param val
   * @returns {Activity}
   */
  tweetText(val) {
    let self = this;
    self.loggingData.tweetText = val;
    return this;
  }

  /**
   * GiftId
   * @param val
   * @returns {Activity}
   */
  giftId(val) {
    let self = this;
    self.loggingData.giftId = val;
    return this;
  }

  /**
   * FrameId
   * @param val
   * @returns {Activity}
   */
  frameId(val) {
    let self = this;
    self.loggingData.frameId = val;
    return this;
  }

  /**
   * CornerId
   * @param val
   * @returns {Activity}
   */
  cornerId(val) {
    let self = this;
    self.loggingData.cornerId = val;
    return this;
  }

  /**
   * sceneId
   * @param val
   * @returns {Activity}
   */
  sceneId(val) {
    let self = this;
    self.loggingData.sceneId = val;
    return this;
  }

  /**
   * sceneKey
   * @param val
   * @returns {Activity}
   */
  sceneKey(val) {
    let self = this;
    self.loggingData.sceneKey = val;
    return this;
  }

  /**
   * コーナー内のSceneで回答された値
   * @param val
   * @returns {Activity}
   */
  sceneAnswer(val) {
    let self = this;
    self.loggingData.sceneAnswer = val;
    return this;
  }

  /**
   * incrementする値
   * @param val {object}
   */
  score(val) {
    let self = this;
    if (_.isObject(val)) {
      self.loggingData.score = val;
    }
    return this;
  }

  /**
   * orbのSNS通知
   * @param val
   */
  orbNotice(val) {
    let self = this;
    self.loggingData.orbNotice = val;
    return this;
  }

  /**
   * 購入Platform
   * @param val
   * @returns {Activity}
   */
  platform(val) {
    let self = this;
    self.loggingData.platform = val;
    return this;
  }

  /**
   * 購入オーダーID
   * @param val
   * @returns {Activity}
   */
  transactionId(val) {
    let self = this;
    self.loggingData.transactionId = val;
    return this;
  }

  /**
   * 商品ID
   * @param val
   * @returns {Activity}
   */
  productId(val) {
    let self = this;
    self.loggingData.productId = val;
    return this;
  }

  /**
   * 商品種別
   * @param val
   * @returns {Activity}
   */
  productType(val) {
    let self = this;
    self.loggingData.productType = val;
    return this;
  }

  /**
   * 値段
   * @param val
   * @returns {Activity}
   */
  price(val) {
    let self = this;
    self.loggingData.price = val;
    return this;
  }

  /**
   * チップ消費したかどうか
   * @param val
   * @returns {Activity}
   */
  tipUsed(val) {
    let self = this;
    self.loggingData.tipUsed = val;
    return this;
  }

  /**
   * チップ消費数
   * @param val
   * @returns {Activity}
   */
  tip(val) {
    let self = this;
    self.loggingData.tip = val;
    return this;
  }

  /**
   * 獲得スター数
   * @param val
   * @returns {Activity}
   */
  star(val) {
    let self = this;
    self.loggingData.star = val;
    return this;
  }

  /**
   * 付与したスタータイプ
   * @param val
   * @returns {Activity}
   */
  grantStarType(val) {
    let self = this;
    self.loggingData.grantStarType = val;
    return this;
  }

  /**
   * 利用したギフト種別
   * @param val
   * @returns {Activity}
   */
  giftType(val) {
    let self = this;
    self.loggingData.giftType = val;
    return this;
  }

  /**
   * 利用したギフト名
   * @param val
   * @returns {Activity}
   */
  giftName(val) {
    let self = this;
    self.loggingData.giftName = val;
    return this;
  }

  /**
   * 有料TIP
   * @param val
   * @returns {Activity}
   */
  chargedTip(val) {
    let self = this;
    self.loggingData.chargedTip = val;
    return this;
  }

  /**
   * 無料TIP
   * @param val
   * @returns {Activity}
   */
  freeTip(val) {
    let self = this;
    self.loggingData.freeTip = val;
    return this;
  }

  /**
   * チャンネル画像Type
   * @param val
   * @returns {Activity}
   */
  channelImageType(val) {
    let self = this;
    self.loggingData.channelImageType = val;
    return this;
  }

  /**
   * 検索ワード
   * @param val
   * @returns {Activity}
   */
  word(val) {
    let self = this;
    self.loggingData.word = val;
    return this;
  }

  /**
   * 結果数
   * @param val
   * @returns {Activity}
   */
  resultLength(val) {
    let self = this;
    self.loggingData.resultLength = val;
    return this;
  }

  /**
   * 配信者かどうか
   * @param val
   * @returns {Activity}
   */
  isPublisher(val) {
    let self = this;
    self.loggingData.isPublisher = val;
    return this;
  }

  /**
   * コーナーのsequenceTransactionId
   * @param val
   * @returns {Activity}
   */
  sequenceTransactionId(val) {
    let self = this;
    self.loggingData.sequenceTransactionId = val;
    return this;
  }

  /**
   * コーナーのquestionTransactionId
   * @param val
   * @returns {Activity}
   */
  questionTransactionId(val) {
    let self = this;
    self.loggingData.questionTransactionId = val;
    return this;
  }

  /**
   * メッセージギフトに対するリアクション
   * @param val
   * @returns {Activity}
   */
  reaction(val) {
    let self = this;
    self.loggingData.reaction = val;
    return this;
  }

  /**
   * stockId
   * @param val
   * @returns {Activity}
   */
  stockId(val) {
    let self = this;
    self.loggingData.stockId = val;
    return this;
  }

  getLoggingJson() {
    return JSON.stringify(this.loggingData);
  }

  apiLog(msg) {
    this.apiLogger.info(msg, this.getLoggingJson());
  }

  purchaseLog(msg) {
    this.purchaseLogger.info(msg, this.getLoggingJson());
  }

  appealLog(msg) {
    this.appealLogger.info(msg, this.getLoggingJson());
  }

  consoleLog(msg) {
    this.consoleLogger.info(msg, this.getLoggingJson());
  }

  workerLog(msg) {
    this.workerLogger.info(msg, this.getLoggingJson());
  }

  tipShortageLog() {
    this.tipShortageLogger.info("", this.getLoggingJson());
  }
}

export default new Activity();
