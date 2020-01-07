"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventHandler = require("./event-handler");

const USER_ID_KEY = 'authentication-pool.user-id';

class AccountHandler {
  constructor({
    api,
    storage,
    bus
  }) {
    this._api = api;
    this._storage = storage;
    this._bus = bus;

    this._addListeners();
  }

  _addListeners() {
    const signUpListener = this._bus.subscribe(_eventHandler.SIGN_UP_EVENT, (message, data) => {
      // Save the customerId after registration, that
      // way the validation process is automatic.
      this._storage.set(USER_ID_KEY, data.customerId);
    });

    const signInListener = this._bus.subscribe(_eventHandler.SIGNED_IN_EVENT, () => this._storage.remove(USER_ID_KEY));

    this._listeners = [signInListener, signUpListener];
  }

  removeListeners() {
    this._listeners.forEach(removeListener => removeListener());
  }

  async validateEmail(code) {
    const customerId = await this._storage.get(USER_ID_KEY);
    const data = await this._api.validateEmail(customerId, code);

    this._bus.publish(_eventHandler.VALIDATE_EMAIL_EVENT, data);

    await this._storage.remove(USER_ID_KEY);
    return data;
  }

  async sendValidationCode(email) {
    const data = await this._api.sendValidationCode(email);

    this._bus.publish(_eventHandler.SEND_VALIDATION_CODE_EVENT, null);

    await this._storage.set(USER_ID_KEY, data.customerId);
    return data;
  }

  async forgetMyPassword(email) {
    const data = await this._api.forgetMyPassword(email);

    this._bus.publish(_eventHandler.FORGOT_PASSWORD_EVENT, {
      email,
      data
    });

    return data;
  }

  async resetPassword(email, code, password) {
    const data = await this._api.resetPassword(email, code, password);

    this._bus.publish(_eventHandler.RESET_PASSWORD_EVENT, {
      data,
      email
    });

    return data;
  }

}

var _default = AccountHandler;
exports.default = _default;