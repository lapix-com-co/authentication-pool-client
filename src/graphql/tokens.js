import gql from 'graphql-tag'

export const REFRESH_TOKEN = gql`
    mutation($input: RefreshTokenInput!) {
        refreshToken(input: $input) {
            accessToken {
                token
                timeToLive
            }
        }
    }
`

export const SIGN_UP = gql`
    mutation($input: SignUpInput!) {
        signUp(input: $input) {
            customerId
            message
            result
        }
    }
`

export const VALIDATE_SIGN_UP = gql`
    mutation($input: ValidateSignUpInput!) {
        validateSignUp(input: $input) {
            result
            message
        }
    }
`

export const SIGN_IN = gql`
    mutation($input: SignInInput!) {
        signIn(input: $input) {
            isNewCustomer
            customer {
                id
                name
                lastName
                email
            }
            accessToken {
                token
                timeToLive
            }
            refreshToken {
                token
            }
        }
    }
`

export const VALIDATE_EMAIL = gql`
    mutation($input: ValidateEmailInput!) {
        validateEmail(input: $input) {
            customer {
                id
                name
                lastName
                email
            }
            accessToken {
                token
                timeToLive
            }
            refreshToken {
                token
            }
        }
    }
`

export const SEND_VALIDATION_CODE = gql`
    mutation($input: SendValidationCodeInput!) {
        sendValidationCode(input: $input) {
            customerId
            message
            result
        }
    }
`

export const FORGET_MY_PASSWORD = gql`
    mutation($input: ForgetMyPasswordInput!) {
        forgetMyPassword(input: $input) {
            message
            result
        }
    }
`

export const RESET_PASSWORD = gql`
    mutation($input: ResetPasswordInput!) {
        resetPassword(input: $input) {
            message
            result
        }
    }
`
