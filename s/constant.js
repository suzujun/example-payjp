import _ from 'underscore';

// 定数
let init = () => {
  let cns = {
    TEST:         'test',
    LOCAL:        'local',
    LOCAL_DOCKER: 'local_docker',
    DEVELOP:      'develop',
    STAGING:      'staging',
    PRODUCTION:   'production',

    // mode
    MODE_API:     "api",
    MODE_WORKER:  "worker",
    MODE_CONSOLE: "console",
    MODE_DEMO:    "demo",

    // msec
    MILLIS_HOUR:  1000 * 60 * 60,
    MILLIS_DAY:   1000 * 60 * 60 * 24,
    MILLIS_WEEK:  1000 * 60 * 60 * 24 * 7,
    MILLIS_WEEK2: 1000 * 60 * 60 * 24 * 14,

    // m_app_settings で設定されているID
    app: {
      setting: {
        DUCK_COMMENT_LIMIT: 'duck_comment_limit_per_sec',
        DUCK_GIFT_LIMIT:    'duck_gift_limit_per_sec',
      }
    },

    authType: {
      ANONYMOUS: 'ANONYMOUS',
      TWITTER:   'TWITTER'
    },

    // 送信/受信ヘッダ
    header: {
      DUCK_APP_ID:               "X-Duck-AppId",
      DUCK_SIGNATURE:            "X-Duck-Signature",
      DUCK_EVENT:                "X-Duck-Event",
      ORION_AUTHORIZATION:       "X-Orion-Authorization",
      COCHARE_IDENTITY_ID:       "X-Cochare-Identity-Id",
      COCHARE_PLATFORM:          "X-Cochare-Platform",
      COCHARE_SESSION_ID:        "X-Cochare-Session-Id",
      REQUEST_UPDATEDAT:  "X-Request-Updated-At",
      RESPONSE_UPDATEDAT: "X-Response-Updated-At",
      APP_VERSION:        "X-App-Version",
      FORCE_UPDATE:       "X-App-Update",
      DEVICE_TOKEN:       "X-Device-Token",
      WORKER_CLIENT_ID:   "X-Worker-ClientId",
      WORKER_SIGNATURE:   "X-Worker-Signature"
    },

    length:       {}, // 変数どうしの参照があるため、以下で算出して設定

    lengthLimit: {
      USER_NICKNAME:         20,
      USER_DESCRIPTION:      160,
      CHANNEL_TITLE:         18,
      CHANNEL_DESCRIPTION:   200,
      COMMENT_MESSAGE:       100,
      STREAM_TITLE:          25,
      NG_WORD_TEXT:          20,
      NOTIFICATION_CONTENTS: 45
    },

    image: {
      UPLOAD_MAXSIZE:          5 * 1024 * 1024, // 5MB
      UPLOAD_ALLOW_MIMETYPES:  [
        'image/jpeg',
        'image/png',
        'image/gif'
      ],
      UPLOAD_ALLOW_EXTENTIONS: [
        'jpg',
        'png',
        'gif'
      ],
      UPLOAD_TEMPORARY_PATH:   'tmp'
    },

    duck: {
      PUBLISHER_ROOM_ID:              '0000000000000',
      FIRST_AUDIENCE_ROOM_ID:         '0000000000001',
      LOOP_DELAY_MILLIS:              100, // 繰り返し実行時の遅延秒
      LOOP_UNIT:                      100, // 繰り返し実行時単位
      HEARTBEAT_INTERVAL_LISTENER:    60, // sec
      HEARTBEAT_INTERVAL_PUBLISHER:   20, // sec
      msgType:                        {
        CREATE_COMMENT:       'createComment',
        DELETE_COMMENT:       'deleteComment',
        ATTACH_SCENE:         'attachScene',
        UPDATE_SCENE:         'updateScene',
        UPDATE_STOCK:         'updateStock',
        PUBLISHER_ANSWER:     'publisherAnswer',
        AUDIENCE_NOTICE:      'audienceNotice',
        ERROR_NOTICE:         'errorNotice',
        CREATE_GIFT:          'createGift',
        RANK_UP:              'rankUp',
        HEARTBEAT:            'heartbeat',
        UPDATE_LIVE_INFO:     'updateLiveInfo',
        OPEN_STREAM:          'openStream',
        CLOSE_STREAM:         'closeStream',
        JOIN_ROOM:            'joinRoom',
        PUBLISHER_FOLLOWINGS: 'publisherFollowings'
      },
      message:                        {
        title: {
          VIEWING_BONUS:  '視聴ボーナス',
          CORNER_BONUS:   'コーナーボーナス',
          LEVEL_UP_BONUS: 'リスナーレベルアップボーナス',
          TWEET_BONUS:    'Twitter拡散ボーナス'
        }
      },
      COMMENT_LIMIT:                  50,
      LISTENERS_STREAM_RANKING_LIMIT: 10
    },

    log: {
      activity: {
        CREATE_CHANNEL:              'createChannel',
        UPDATE_CHANNEL:              'updateChannel',
        UPLOAD_CHANNEL_IMAGE:        'uploadChannelImage',
        FOLLOW:                      'follow',
        UNFOLLOW:                    'unfollow',
        BLOCK_USER:                  'blockUser',
        UNBLOCK_USER:                'unblockUser',
        ADD_NG_WORD:                 'addNgWord',
        REMOVE_NG_WORD:              'removeNgWord',
        LOGIN:                       'login',
        ADD_ENDPOINT:                'addEndpoint',
        DISABLE_ENDPOINT:            'disableEndpoint',
        LINK_PROVIDER:               'linkProvider',
        UNLINK_PROVIDER:             'unlinkProvider',
        LOGIN_WEB_ANONYMOUS:         'loginWebAnonymous',
        LOGOUT:                      'logout',
        PURCHASE:                    'purchase',
        CREATE_STREAM:               'createStream',
        UPDATE_STREAM:               'updateStream',
        UPLOAD_STREAM_IMAGE:         'uploadStreamImage',
        DELETE_STREAM:               'deleteStream',
        SEND_GIFT:                   'sendGift',
        CREATE_SCENE:                'createScene',
        CREATE_SCENE_ANSWER:         'createSceneAnswer',
        CREATE_COMMENT:              'createComment',
        CREATE_GIFT_ANSWER:          'createGiftAnswer',
        DELETE_COMMENT:              'deleteComment',
        START_STREAM:                'startStream',
        END_STREAM:                  'endStream',
        INCREMENT_VIDEO_VIEW:        'incrementVideoView',
        SHARE_TWITTER:               'shareTwitter',
        TWEET_WITH_MEDIA:            'tweetWithMedia',
        UPDATE_USER:                 'updateUser',
        UPLOAD_USER_IMAGE:           'uploadUserImage',
        ORB_NOTICE:                  'orbNotice',
        FOLLOW_TWITTER:              'followTwitter',
        UNFOLLOW_TWITTER:            'unfollowTwitter',
        GRANT_CORNER_BONUS:          'grantCornerBonus',
        SEARCH:                      'search',
        SEARCH_TOP:                  'searchTop',
        PURCHASE_PAY_CORNER:         'purchasePayCorner',
        ENTRY_CORNER:                'entryCorner',
        REFUND_DEPOSIT:              'refundDeposit',
        REFUND_UNUSED_STOCK_DEPOSIT: 'refundUnusedStockDeposit',
        CONTINUE_CORNER:             'continueCorner'
      }
    },

    sitemap: {
      LOCAL_DIR:   '/sitemaps',
      S3_BASE:     'common/sitemaps',
      WEB_BASE:    'explore/sitemaps',
      REPLACE_STR: '{num}',
      files:       {
        INDEX_XML:   'sitemap-index.xml',
        BASE_XML:    'sitemap-base.xml',
        CHANNEL_XML: 'sitemap-channel.{num}.xml',
        STREAM_XML:  'sitemap-stream.{num}.xml'
      }
    }
  };

  /** ユーザバッジ：star数で判断しているので星の多い順にソート */
  cns.badges = _.sortBy(cns.badges, badge => {
    return -badge.star;
  });

  /**************
   * Length
   **************/
  cns.length.UNIX_MILLIS = 13;
  cns.length.SESSION_ID = 32;
  cns.length.SESSION_TOKEN = 32;
  cns.length.USER_ID = 32;
  cns.length.CHANNEL_ID = cns.length.USER_ID;
  cns.length.ROOM_ID = 13;
  cns.length.CORNER_ID = 5;
  cns.length.NG_WORD = 20;
  cns.length.PLATFORM = 3;

  return cns;
};

module.exports = init();
