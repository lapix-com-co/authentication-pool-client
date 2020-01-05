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
    return response.data;
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
    return data;
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
    return data;
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
    return data;
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
    return data;
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
    return response.data;
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
    return data;
  }

}

var _default = API;
exports.default = _default;