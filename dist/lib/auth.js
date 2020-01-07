"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventHandler = require("./event-handler");

var _tokenManager = require("./token-manager");

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
    const validateEmailListener = this._bus.subscribe(_eventHandler.VALIDATE_EMAIL_EVENT, (message, data) => this._tokenProvider.save(data));

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
    let tokens = null;
    const notAuthenticatedMessage = 'User not authenticated';

    try {
      tokens = await this._tokenProvider.getValidTokens();
    } catch (error) {
      if (error instanceof _tokenManager.SessionExpiredError) {
        await this.signOut();
        throw new Error(notAuthenticatedMessage);
      }

      throw error;
    }

    if (!tokens) {
      throw new Error(notAuthenticatedMessage);
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
    if (!provider) {
      throw new Error('provider can not be empty');
    }

    if (!email) {
      throw new Error('email can not be empty');
    }

    if (!secret) {
      throw new Error('secret can not be empty');
    }

    const data = await this._api.signIn({
      provider,
      email,
      secret
    });
    await this._tokenProvider.save(data);

    this._bus.publish(_eventHandler.SIGNED_IN_EVENT, data);
  }

  async signOut() {
    await this._tokenProvider.clear();

    this._bus.publish(_eventHandler.SIGN_OUT_EVENT, null);

    return null;
  }

}

var _default = Auth;
exports.default = _default;