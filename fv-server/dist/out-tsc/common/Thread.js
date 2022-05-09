"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thread = void 0;
var User_1 = require("./User");
var Thread = /** @class */ (function () {
    function Thread(relevantRatio, name, author, topic1, topic2, topic3, text) {
        if (relevantRatio === void 0) { relevantRatio = 0; }
        if (name === void 0) { name = ""; }
        if (author === void 0) { author = new User_1.User(); }
        if (topic1 === void 0) { topic1 = false; }
        if (topic2 === void 0) { topic2 = false; }
        if (topic3 === void 0) { topic3 = false; }
        if (text === void 0) { text = ""; }
        this.relevantRatio = relevantRatio;
        this.name = name;
        this.author = author;
        this.topic1 = topic1;
        this.topic2 = topic2;
        this.topic3 = topic3;
        this.text = text;
        this.id = -1;
        this.timeCreated = new Date();
        this.lastReply = this.timeCreated.getSeconds();
        this.replies = [];
        this.isLocked = false;
    }
    return Thread;
}());
exports.Thread = Thread;
//# sourceMappingURL=Thread.js.map