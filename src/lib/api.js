import {
  FORGET_MY_PASSWORD, REFRESH_TOKEN,
  RESET_PASSWORD,
  SEND_VALIDATION_CODE,
  SIGN_IN,
  SIGN_UP,
  VALIDATE_EMAIL,
  VALIDATE_SIGN_UP,
} from '../graphql/tokens'

class API {
  /**
   * @param client
   * @param logger
   */
  constructor(client, logger) {
    this._client = client
    this._logger = logger
  }

  /**
   * @param input
   * @returns {*}
   * @private
   */
  _post(input) {
    this._logger.debug('new authentication request', input)
    const response = this._client.mutate(input)
    this._logger.debug('authentication response', response)

    return response
  }

  /**
   * @param customerId
   * @param code
   * @returns {any}
   */
  async validateEmail(customerId, code) {
    const response = await this._post({
      mutation: VALIDATE_EMAIL,
      variables: {
        input: { customerId, code },
      },
    })

    return response.data.validateEmail
  }

  /**
   * @param email
   * @returns {any}
   */
  async sendValidationCode(email) {
    const variables = { input: { email } }
    const { data } = await this._post({
      mutation: SEND_VALIDATION_CODE,
      variables,
    })

    return data.sendValidationCode
  }

  /**
   * @param email
   * @returns {any}
   */
  async forgetMyPassword(email) {
    const { data } = await this._post({
      mutation: FORGET_MY_PASSWORD,
      variables: { input: { email } },
    })

    return data.forgetMyPassword
  }

  /**
   * @param email
   * @param code
   * @param password
   * @returns {any}
   */
  async resetPassword(email, code, password) {
    const { data } = await this._post({
      mutation: RESET_PASSWORD,
      variables: { input: { email, code, password } },
    })

    return data.resetPassword
  }

  /**
   * @param email
   * @param password
   * @returns {any}
   */
  async signUp({ email, password }) {
    const { data } = await this._post({
      mutation: SIGN_UP,
      variables: { input: { email, password } },
    })

    return data.signUp
  }

  /**
   * @param email
   * @param password
   * @returns {any}
   */
  async validateSignUp({ email, password }) {
    const { data } = await this._post({
      mutation: VALIDATE_SIGN_UP,
      variables: { input: { email, password } },
    })

    return data.validateSignUp
  }

  /**
   * @param provider
   * @param email
   * @param secret
   * @returns {any}
   */
  async signIn({ provider, email, secret }) {
    const response = await this._post({
      mutation: SIGN_IN,
      variables: { input: { provider, email, secret } },
    })

    return response.data.signIn
  }

  /**
   * @param accessToken
   * @param refreshToken
   * @returns {any}
   */
  async refreshToken(accessToken, refreshToken) {
    const { data } = await this._post({
      mutation: REFRESH_TOKEN,
      variables: { input: { accessToken, refreshToken } },
    })

    return data.refreshToken
  }
}

export default API
