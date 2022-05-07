"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
var Ack_1 = require("../common/Ack");
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.tryRegisterUser = function (user) {
        var ack;
        if (this._isMissingFieldRegister(user))
            ack = Ack_1.ACK.REGISTER_USER.MISSING_FIELD;
        else if (this._isNameDuplicate(user))
            ack = Ack_1.ACK.REGISTER_USER.DUPLICATE_USERNAME;
        else if (this._isEmailAndPasswordDuplicate(user))
            ack = Ack_1.ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS;
        else if (this._isAdminTokenInvalid(user))
            ack = Ack_1.ACK.REGISTER_USER.INVALID_TOKEN;
        else {
            ack = Ack_1.ACK.REGISTER_USER.OK;
            this._registeredUsers.push(user);
        }
        return ack;
    };
    UserService.tryLoginUser = function (user) {
        var ack;
        if (this._isMissingFieldLogin(user))
            ack = Ack_1.ACK.LOGIN.MISSING_FIELD;
        else {
            // the user passed in only has fields email and password filled in
            var fullUser = this._getFullUserFromLoginInfo(user);
            if (fullUser == undefined)
                ack = Ack_1.ACK.LOGIN.USER_NOT_FOUND;
            else {
                ack = Ack_1.ACK.LOGIN.OK;
                ack.body = fullUser;
            }
        }
        return ack;
    };
    UserService._isMissingFieldRegister = function (user) {
        var isMissing = user.name == "" || user.email == "" || user.password == "";
        if (user.isAdmin)
            isMissing = isMissing || user.adminToken == "";
        return isMissing;
    };
    UserService._isEmailAndPasswordDuplicate = function (user) {
        return this._registeredUsers
            .find(function (u) {
            return u.email == user.email &&
                u.password == user.password;
        }) != undefined;
    };
    UserService._isMissingFieldLogin = function (user) {
        return user.email == "" || user.password == "";
    };
    UserService._isNameDuplicate = function (user) {
        return this._registeredUsers.find(function (u) { return u.name == user.name; }) != undefined;
    };
    UserService._isAdminTokenInvalid = function (user) {
        return user.isAdmin && !(this._tokens.includes(user.adminToken));
    };
    UserService._getFullUserFromLoginInfo = function (user) {
        return this._registeredUsers.find(function (u) { return u.password == user.password && u.email == user.email; });
    };
    // ONLY USED FOR TESTING
    UserService._clearRegisteredUsers = function () {
        this._registeredUsers.length = 0;
        return Ack_1.ACK.OK;
    };
    UserService._registeredUsers = [];
    // TODO: change to '_availableTokens'
    UserService._tokens = ["123", "456"]; // never remove "123" or "456"
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map