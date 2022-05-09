"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var User_1 = require("../common/User");
var UserService_1 = require("./UserService");
var threadService_1 = require("./threadService");
var util_1 = require("./util");
var fvUrls_1 = require("../common/fvUrls");
var fvServer = (0, express_1.default)();
var threadService = new threadService_1.ThreadService();
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
fvServer.get('/threads', function (req, res) {
    res.send(JSON.stringify(threadService.getThreads()));
});
fvServer.get('/thread/:thread', function (req, res) {
    var thread_id = req.params.thread;
    thread_id = util_1.Util.getParameter(thread_id);
    res.send(JSON.stringify(threadService.getThreadByID(parseInt(thread_id))));
});
fvServer.post('/thread', function (req, res) {
    var thread = req.body;
    var ack = threadService.tryCreateThread(thread);
    res.send(ack);
});
fvServer.put('/newreply/:thread', function (req, res) {
    var thread_id = parseInt(util_1.Util.getParameter(req.params.thread));
    var reply = req.body;
    var ack = threadService.trySendReply(reply, thread_id);
    res.send(ack);
});
fvServer.delete('/thread/:thread/:user', function (req, res) {
    var thread_id = parseInt(util_1.Util.getParameter(req.params.thread));
    var user = UserService_1.UserService.getUserByName(util_1.Util.getParameter(req.params.user));
    var ack = threadService.DeleteThreadById(thread_id, user);
    res.send(ack);
});
fvServer.delete('/deletereply/:thread/:reply/:user', function (req, res) {
    var thread_id = parseInt(util_1.Util.getParameter(req.params.thread));
    var reply_id = parseInt(util_1.Util.getParameter(req.params.reply));
    var user = UserService_1.UserService.getUserByName(util_1.Util.getParameter(req.params.user));
    var ack = threadService.DeleteReplyById(reply_id, thread_id, user);
    res.send(ack);
});
// Lock and unlock threads
fvServer.put('/thread/:thread/:wannaLock', function (req, res) {
    var thread_id = parseInt(util_1.Util.getParameter(req.params.thread));
    var wannaLock = (util_1.Util.getParameter(req.params.wannaLock) == 'true');
    var user = req.body;
    var ack = threadService.toggleLockThreadById(thread_id, user, wannaLock);
    res.send(ack);
});
// for tests
fvServer.get('/clear_users', function (req, res) {
    var code = UserService_1.UserService._clearRegisteredUsers();
    res.sendStatus(code);
});
fvServer.get('/clear_threads', function (req, res) {
    var code = threadService._clear();
    res.sendStatus(code);
});
fvServer.listen(fvUrls_1.SERVER_PORT, function () {
    console.log("Forumverse Server listening on port ".concat(fvUrls_1.SERVER_PORT, "!"));
});
//# sourceMappingURL=main.js.map