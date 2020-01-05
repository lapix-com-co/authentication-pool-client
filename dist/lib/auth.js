"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventHandler = require("./event-handler");

class Auth {
  constructor({
    bus,
    api,
    tokenProvider
  }) {
    this._bus = bus;
    this._api = api;
    this._tokenProvider = tokenProvider;

    this._addListeners();
  }

  _addListeners() {
    const validateEmailListener = this._bus.subscribe(_eventHandler.VALIDATE_EMAIL_EVENT, data => this._tokenProvider.save(data));

    this._listeners = [validateEmailListener];
  }

  removeListeners() {
    this._listeners.forEach(removeListener => removeListener());
  }

  async check() {
    const tokens = await this._tokenProvider.currentTokens();
    return !!tokens;
  }

  async currentSession() {
    const tokens = await this._tokenProvider.getValidTokens();

    if (!tokens) {
      throw new Error('User not authenticated');
    }

    return {
      tokens
    };
  }

  async signUp({
    email,
    password
  }) {
    const data = await this._api.signUp({
      email,
      password
    });

    this._bus.publish(_eventHandler.SIGN_UP_EVENT, data);
  }

  async signIn({
    provider,
    email,
    secret
  }) {
    try {
      const data = await this._api.signIn({
        provider,
        email,
        secret
      });

      this._tokenProvider.save(data);

      this._bus.publish(_eventHandler.SIGNED_IN_EVENT, data);
    } catch (error) {
      throw new Error(`api error: ${error.message}`);
    }
  }

  async signOut() {
    await this._tokenProvider.clear();

    this._bus.publish(_eventHandler.SIGN_OUT_EVENT, null);

    return null;
  }

}

var _default = Auth;
exports.default = _default;