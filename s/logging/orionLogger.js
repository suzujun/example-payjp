import moment from 'moment';

import ctx from '../context';
import commonWeb from '../common/web';

let orionReportLog = ctx.log('orion_claim');
let orionCommentAllLog = ctx.log('orion_comment_all');

/**
 * Orion ロギング
 *
 * orion JSON 仕様定義
 * https://wiki.ca-tools.org/pages/viewpage.action?pageId=40511172#Orion／監視サービス新規導入／AMESTAGE-ログ
 */
class OrionLogger {

  // reqが無いパターンもあるため、userIdは別途指定
  constructor() {
    let conf = ctx.config.getCommon().orion;
    this.clientId = conf.clientId;
  }

  /**
   * クレーム通報
   * @param userId
   * @param targetUser
   * @param stream
   * @param comment
   * @param reason
   */
  outputClaim(userId, targetUser, stream, comment, reason) {
    let body = {
      time: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ"), // format:"2006-01-02T15:04:05.000Z0700"
      clientId: this.clientId,
      observationId: "claim", // 固定値
      nativeId: userId, // 通報者のユーザID
      postId: comment._id,
      data: {
        title: stream.title,
        url: commonWeb.generateStreamUrl(stream._id),
        style: stream.status,
        category: reason,
        comment: comment.body.message,
        recipientNativeID: targetUser._id,
        recipientNickname: targetUser.nickname
      }
    };
    let jsonString = JSON.stringify(body);
    orionReportLog.info(jsonString);
  }

  /**
   * 全件コメント連携
   * @param stream
   * @param user
   * @param commentId
   * @param message
   */
  outputCommentAll(stream, user, commentId, message) {
    let body = {
      time: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ"), // format:"2006-01-02T15:04:05.000Z0700"
      clientId: this.clientId,
      observationId: "comment", // 固定値
      nativeId: user._id,
      postId: commentId,
      data: {
        title: stream.title,
        url: commonWeb.generateStreamUrl(stream._id),
        style: stream.status,
        nickname: user.nickname,
        comment: message
      }
    };
    let jsonString = JSON.stringify(body);
    orionCommentAllLog.info(jsonString);
  }


}

export default new OrionLogger();
