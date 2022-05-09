"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reply = void 0;
var Reply = /** @class */ (function () {
    function Reply(author, content, quotedReply) {
        if (quotedReply === void 0) { quotedReply = null; }
        this.id = -1;
        this.author = author;
        this.content = content;
        this.timeSent = new Date();
        this.quoteOf = quotedReply;
    }
    return Reply;
}());
exports.Reply = Reply;
//# sourceMappingURL=Reply.js.map