"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESET_PASSWORD = exports.FORGET_MY_PASSWORD = exports.SEND_VALIDATION_CODE = exports.VALIDATE_EMAIL = exports.SIGN_IN = exports.SIGN_UP = exports.REFRESH_TOKEN = void 0;

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REFRESH_TOKEN = _graphqlTag.default`
    mutation($input: RefreshTokenInput!) {
        refreshToken(input: $input) {
            accessToken {
                expiredAt
                token
            }
        }
    }
`;
exports.REFRESH_TOKEN = REFRESH_TOKEN;
const SIGN_UP = _graphqlTag.default`
    mutation($input: SignUpInput!) {
        signUp(input: $input) {
            customerId
            message
            result
        }
    }
`;
exports.SIGN_UP = SIGN_UP;
const SIGN_IN = _graphqlTag.default`
    mutation($input: SignInInput!) {
        signIn(input: $input) {
            customer {
                id
                name
                lastName
                email
            }
            accessToken {
                token
                expiredAt
            }
            refreshToken {
                token
            }
        }
    }
`;
exports.SIGN_IN = SIGN_IN;
const VALIDATE_EMAIL = _graphqlTag.default`
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
                expiredAt
            }
            refreshToken {
                token
            }
        }
    }
`;
exports.VALIDATE_EMAIL = VALIDATE_EMAIL;
const SEND_VALIDATION_CODE = _graphqlTag.default`
    mutation($input: SendValidationCodeInput!) {
        sendValidationCode(input: $input) {
            customerId
            message
            result
        }
    }
`;
exports.SEND_VALIDATION_CODE = SEND_VALIDATION_CODE;
const FORGET_MY_PASSWORD = _graphqlTag.default`
    mutation($input: ForgetMyPasswordInput!) {
        forgetMyPassword(input: $input) {
            message
            result
        }
    }
`;
exports.FORGET_MY_PASSWORD = FORGET_MY_PASSWORD;
const RESET_PASSWORD = _graphqlTag.default`
    mutation($input: ResetPasswordInput!) {
        resetPassword(input: $input) {
            message
            result
        }
    }
`;
exports.RESET_PASSWORD = RESET_PASSWORD;