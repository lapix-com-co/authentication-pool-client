import {
  FORGET_MY_PASSWORD, REFRESH_TOKEN,
  RESET_PASSWORD,
  SEND_VALIDATION_CODE,
  SIGN_IN,
  SIGN_UP,
  VALIDATE_EMAIL,
} from '../graphql/tokens'

class API {
  constructor(client) {
    this._client = client
  }

  _post(input) {
    return this._client.mutate(input)
  }

  async validateEmail(customerId, code) {
    const response = await this._post({
      mutation: VALIDATE_EMAIL,
      variables: {
        input: { customerId, code },
      },
    })

    return response.data
  }

  async sendValidationCode(email) {
    const variables = { input: { email } }
    const { data } = await this._post({
      mutation: SEND_VALIDATION_CODE,
      variables,
    })

    return data
  }

  async forgetMyPassword(email) {
    const { data } = await this._post({
      mutation: FORGET_MY_PASSWORD,
      variables: { input: { email } },
    })

    return data
  }

  async resetPassword(email, code, password) {
    const { data } = await this._post({
      mutation: RESET_PASSWORD,
      variables: { input: { email, code, password } },
    })

    return data
  }

  async signUp({ email, password }) {
    const { data } = await this._post({
      mutation: SIGN_UP,
      variables: { input: { email, password } },
    })

    return data
  }

  async signIn({ provider, email, secret }) {
    const response = await this._post({
      mutation: SIGN_IN,
      variables: { input: { provider, email, secret } },
    })

    return response.data
  }

  async refreshToken(accessToken, refreshToken) {
    const { data } = await this._post({
      mutation: REFRESH_TOKEN,
      variables: { input: { accessToken, refreshToken } },
    })

    return data
  }
}

export default API
