"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(email, name, password, isAdmin, adminToken) {
        if (email === void 0) { email = ""; }
        if (name === void 0) { name = ""; }
        if (password === void 0) { password = ""; }
        if (isAdmin === void 0) { isAdmin = false; }
        if (adminToken === void 0) { adminToken = ""; }
        this.email = email;
        this.name = name;
        this.password = password;
        this.isAdmin = isAdmin;
        this.adminToken = adminToken;
    }
    User.fromAny = function (from) {
        var u = new User();
        for (var key in from)
            u[key] = from[key];
        return u;
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map