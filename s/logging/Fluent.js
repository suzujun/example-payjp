import winston from 'winston';
import fluentLogger from 'fluent-logger';

/**
 * Fluentd transport for Winston
 */
export default class Fluent extends winston.Transport {

  /**
   * Construct
   * @param options
   */
  constructor(options={}) {
    super(options);
    if (!options.tag){
      throw new Error("requires 'tag' property");
    }
    if (!options.label){
      throw new Error("requires 'label' property");
    }
    this.name = 'fluent';
    this.tag = options.tag;
    this.label = options.label;
    this.sender = fluentLogger.createFluentSender(this.tag, {
      host:    options.host || '127.0.0.1',
      port:    options.port || 24224,
      timeout: options.timeout || 3.0
    });
    this.sender.on('error', (err) => {
      // error logging with the dev logger (error will be ignored)
      winston.loggers.get('system').error('error occurred in fluent transport. err=%s', JSON.stringify(err));
    });
  }

  /**
   * Override to winston.Transport.log
   * @param level
   * @param message
   * @param meta
   * @param callback
   */
  log (level, message, meta, callback) {
    let self = this;
    let data = {
      level:      level,
      message:    message,
      extra:      this._toExtra(meta)
    };
    let fixedLabel = this.label + '.' + level;
    this.sender.emit(fixedLabel, data, (err) => {
      if (err) {
        // error logging with the dev logger (error will be ignored)
        return winston.loggers.get('system').error('failed to send log entity to fluent. err=%s', JSON.stringify(err));
      } else {
        // emit the `logged` event.
        return self.emit('logged');
      }
    });
    callback(null, true);
  };


  /**
   * Convert meta to extra string
   * @param meta
   * @returns {*}
   * @private
   */
  _toExtra(meta) {
    if (!meta || meta === null) {
      return '';
    }
    switch (typeof meta) {
      case 'string':
        return meta;
      case 'number':
        return String(meta);
      case 'boolean':
        return String(meta);
      default:
        return JSON.stringify(meta) || '';
    }
  }
}
