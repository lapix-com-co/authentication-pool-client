"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Auth", {
  enumerable: true,
  get: function () {
    return _auth.default;
  }
});
Object.defineProperty(exports, "TokenManager", {
  enumerable: true,
  get: function () {
    return _tokenManager.default;
  }
});
Object.defineProperty(exports, "StorageWrapper", {
  enumerable: true,
  get: function () {
    return _storageWrapper.default;
  }
});
Object.defineProperty(exports, "JSONParser", {
  enumerable: true,
  get: function () {
    return _storageWrapper.JSONParser;
  }
});
Object.defineProperty(exports, "InMemoryProvider", {
  enumerable: true,
  get: function () {
    return _storageWrapper.InMemoryProvider;
  }
});
Object.defineProperty(exports, "eventHandler", {
  enumerable: true,
  get: function () {
    return _eventHandler2.default;
  }
});
Object.defineProperty(exports, "AccountHandler", {
  enumerable: true,
  get: function () {
    return _account.default;
  }
});
Object.defineProperty(exports, "API", {
  enumerable: true,
  get: function () {
    return _api.default;
  }
});

var _auth = _interopRequireDefault(require("./lib/auth"));

var _tokenManager = _interopRequireDefault(require("./lib/token-manager"));

var _storageWrapper = _interopRequireWildcard(require("./lib/storage-wrapper"));

var _eventHandler2 = _interopRequireDefault(require("./lib/event-handler"));

var _account = _interopRequireDefault(require("./lib/account"));

var _api = _interopRequireDefault(require("./lib/api"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }