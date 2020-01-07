"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RESET_PASSWORD_EVENT = exports.REFRESH_TOKEN_EVENT = exports.SEND_VALIDATION_CODE_EVENT = exports.VALIDATE_EMAIL_EVENT = exports.FORGOT_PASSWORD_EVENT = exports.SIGN_OUT_EVENT = exports.SIGNED_IN_EVENT = exports.SIGN_UP_EVENT = void 0;

var _pubsubJs = _interopRequireDefault(require("pubsub-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SIGN_UP_EVENT = 'authentication-pool.signed-up';
exports.SIGN_UP_EVENT = SIGN_UP_EVENT;
const SIGNED_IN_EVENT = 'authentication-pool.signed-in';
exports.SIGNED_IN_EVENT = SIGNED_IN_EVENT;
const SIGN_OUT_EVENT = 'authentication-pool.signed-out';
exports.SIGN_OUT_EVENT = SIGN_OUT_EVENT;
const FORGOT_PASSWORD_EVENT = 'authentication-pool.forgot-password';
exports.FORGOT_PASSWORD_EVENT = FORGOT_PASSWORD_EVENT;
const VALIDATE_EMAIL_EVENT = 'authentication-pool.validate-email';
exports.VALIDATE_EMAIL_EVENT = VALIDATE_EMAIL_EVENT;
const SEND_VALIDATION_CODE_EVENT = 'authentication-pool.send-validation-code-event';
exports.SEND_VALIDATION_CODE_EVENT = SEND_VALIDATION_CODE_EVENT;
const REFRESH_TOKEN_EVENT = 'authentication-pool.refresh-token-event';
exports.REFRESH_TOKEN_EVENT = REFRESH_TOKEN_EVENT;
const RESET_PASSWORD_EVENT = 'authentication-pool.reset-password-event';
exports.RESET_PASSWORD_EVENT = RESET_PASSWORD_EVENT;
const eventHandler = {
  publish: _pubsubJs.default.publish,
  clearAll: _pubsubJs.default.clearAllSubscriptions,
  clear: _pubsubJs.default.clearSubscriptions,
  subscribe: (event, callback) => {
    const token = _pubsubJs.default.subscribe(event, callback);

    return () => _pubsubJs.default.unsubscribe(token);
  }
};
var _default = eventHandler;
exports.default = _default;