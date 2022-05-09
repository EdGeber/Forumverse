"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACK = exports.Ack = void 0;
var Ack = /** @class */ (function () {
    function Ack(src, code, body) {
        this.src = src;
        this.code = code;
        this.body = body;
    }
    Ack.fromAny = function (from) {
        var a = new Ack("", 0);
        for (var key in from)
            a[key] = from[key];
        return a;
    };
    return Ack;
}());
exports.Ack = Ack;
exports.ACK = {
    OK: 0,
    REGISTER_USER: {
        OK: new Ack("registerUser", 0),
        MISSING_FIELD: new Ack("registerUser", 1),
        DUPLICATE_USERNAME: new Ack("registerUser", 2),
        INVALID_TOKEN: new Ack("registerUser", 3),
        DUPLICATE_EMAIL_AND_PASS: new Ack("registerUser", 4),
    },
    GET_LOGGED_USER: {
        OK: new Ack("getLoggedUser", 0),
    },
    GET_THREAD: {
        OK: new Ack("getThread", 0),
    },
    GET_THREAD_ARRAY: {
        OK: new Ack("getThreadArray", 0),
    },
    THREAD: {
        OK: new Ack("Thread", 0),
        MISSING_NAMEFIELD: new Ack("Thread", 200),
        MISSING_TOPICFIELD: new Ack("Thread", 201),
        MISSING_THREAD: new Ack("Thread", 202),
        DUPLICATE_THREADNAME: new Ack("Thread", 203),
        //250 to 299: THREAD OPERATIONS
        EMPTY_REPLY_MSG: new Ack('Thread', 250),
        UNEXPECTED_ERROR: new Ack('Thread', 251),
        DELETE_PERMISSION_DENIED: new Ack('Thread', 252),
        LOCKED_THREAD: new Ack('Thread', 253),
        TOGGLE_LOCK_PERMISSION_DENIED: new Ack('Thread', 257),
        TOGGLE_LOCK_THREAD: new Ack('Thread', 258),
    },
    LOGIN: {
        OK: new Ack("login", 0),
        MISSING_FIELD: new Ack("login", 301, null),
        USER_NOT_FOUND: new Ack("login", 302, null)
    },
    LOGOUT: {
        OK: new Ack("logout", 0),
    }
};
//# sourceMappingURL=Ack.js.map