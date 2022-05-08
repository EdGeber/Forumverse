"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var User_1 = require("../common/User");
var UserService_1 = require("./UserService");
var fvServer = (0, express_1.default)();
var PORT = 3000; // don't change, that's used in common/fvUrls
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
fvServer.use(allowCrossDomain);
fvServer.use(express_1.default.json());
// PUT: modify existing resource
// POST: add new resource
fvServer.post('/register', function (req, res) {
    var ack = UserService_1.UserService.tryRegisterUser(User_1.User.fromAny(req.body));
    res.send(ack);
});
fvServer.put('/login', function (req, res) {
    var ack = UserService_1.UserService.tryLoginUser(User_1.User.fromAny(req.body));
    res.send(ack);
});
// for tests
fvServer.get('/clear_users', function (req, res) {
    var code = UserService_1.UserService._clearRegisteredUsers();
    res.send(code);
});
fvServer.listen(PORT, function () {
    console.log("Forumverse Server listening on port ".concat(PORT, "!"));
});
//# sourceMappingURL=main.js.map