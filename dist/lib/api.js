"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tokens = require("../graphql/tokens");

class API {
  constructor(client) {
    this._client = client;
  }

  _post(input) {
    return this._client.mutate(input);
  }

  async validateEmail(customerId, code) {
    const response = await this._post({
      mutation: _tokens.VALIDATE_EMAIL,
      variables: {
        input: {
          customerId,
          code
        }
      }
    });
    return response.data.validateEmail;
  }

  async sendValidationCode(email) {
    const variables = {
      input: {
        email
      }
    };
    const {
      data
    } = await this._post({
      mutation: _tokens.SEND_VALIDATION_CODE,
      variables
    });
    return data.sendValidationCode;
  }

  async forgetMyPassword(email) {
    const {
      data
    } = await this._post({
      mutation: _tokens.FORGET_MY_PASSWORD,
      variables: {
        input: {
          email
        }
      }
    });
    return data.forgetMyPassword;
  }

  async resetPassword(email, code, password) {
    const {
      data
    } = await this._post({
      mutation: _tokens.RESET_PASSWORD,
      variables: {
        input: {
          email,
          code,
          password
        }
      }
    });
    return data.resetPassword;
  }

  async signUp({
    email,
    password
  }) {
    const {
      data
    } = await this._post({
      mutation: _tokens.SIGN_UP,
      variables: {
        input: {
          email,
          password
        }
      }
    });
    return data.signUp;
  }

  async signIn({
    provider,
    email,
    secret
  }) {
    const response = await this._post({
      mutation: _tokens.SIGN_IN,
      variables: {
        input: {
          provider,
          email,
          secret
        }
      }
    });
    return response.data.signIn;
  }

  async refreshToken(accessToken, refreshToken) {
    const {
      data
    } = await this._post({
      mutation: _tokens.REFRESH_TOKEN,
      variables: {
        input: {
          accessToken,
          refreshToken
        }
      }
    });
    return data.refreshToken;
  }

}

var _default = API;
exports.default = _default;