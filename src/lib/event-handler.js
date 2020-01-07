import PubSub from 'pubsub-js'

export const SIGN_UP_EVENT = 'authentication-pool.signed-up'
export const SIGNED_IN_EVENT = 'authentication-pool.signed-in'
export const SIGN_OUT_EVENT = 'authentication-pool.signed-out'
export const FORGOT_PASSWORD_EVENT = 'authentication-pool.forgot-password'
export const VALIDATE_EMAIL_EVENT = 'authentication-pool.validate-email'
export const SEND_VALIDATION_CODE_EVENT = 'authentication-pool.send-validation-code-event'
export const REFRESH_TOKEN_EVENT = 'authentication-pool.refresh-token-event'
export const RESET_PASSWORD_EVENT = 'authentication-pool.reset-password-event'

const eventHandler = {
  publish: PubSub.publish,
  clearAll: PubSub.clearAllSubscriptions,
  clear: PubSub.clearSubscriptions,
  subscribe: (event, callback) => {
    const token = PubSub.subscribe(event, callback)
    return () => PubSub.unsubscribe(token)
  },
}

export default eventHandler
