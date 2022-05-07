"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var UserService_1 = require("../../../UserService");
var Ack_1 = require("../../../../common/Ack");
var User_1 = require("../../../../common/User");
// test writing is mostly driven by the possible ack error
// codes each method can raise
describe("UserService's tryRegisterUser", function () {
    afterEach(function () { return UserService_1.UserService._clearRegisteredUsers(); });
    it("tells when a user field is missing on the registration", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var user1, user2, user3, user4, user5, admin6, admin7, ack1, ack2, ack3, ack4, ack5, ack6, ack7;
        return tslib_1.__generator(this, function (_a) {
            user1 = new User_1.User();
            user2 = new User_1.User('email2', 'name2', 'pass2');
            user3 = new User_1.User('email3', 'name3');
            user4 = new User_1.User('email4', '', 'pass4');
            user5 = new User_1.User('', 'name5', 'pass5');
            admin6 = new User_1.User('email6', 'name6', 'pass6', true, '123');
            admin7 = new User_1.User('email7', 'name7', 'pass7', true);
            ack1 = (UserService_1.UserService.tryRegisterUser(user1));
            ack2 = (UserService_1.UserService.tryRegisterUser(user2));
            ack3 = (UserService_1.UserService.tryRegisterUser(user3));
            ack4 = (UserService_1.UserService.tryRegisterUser(user4));
            ack5 = (UserService_1.UserService.tryRegisterUser(user5));
            ack6 = (UserService_1.UserService.tryRegisterUser(admin6));
            ack7 = (UserService_1.UserService.tryRegisterUser(admin7));
            expect(ack1).toEqual(Ack_1.ACK.REGISTER_USER.MISSING_FIELD);
            expect(ack2).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack3).toEqual(Ack_1.ACK.REGISTER_USER.MISSING_FIELD);
            expect(ack4).toEqual(Ack_1.ACK.REGISTER_USER.MISSING_FIELD);
            expect(ack5).toEqual(Ack_1.ACK.REGISTER_USER.MISSING_FIELD);
            expect(ack6).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack7).toEqual(Ack_1.ACK.REGISTER_USER.MISSING_FIELD);
            return [2 /*return*/];
        });
    }); });
    it("tells when the username is duplicate", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var user1, user2, admin3, admin4, admin5, user6, ack1, ack2, ack3, ack4, ack5, ack6;
        return tslib_1.__generator(this, function (_a) {
            user1 = new User_1.User('email1', 'name', 'pass1');
            user2 = new User_1.User('email3', 'name', 'pass2');
            admin3 = new User_1.User('email4', 'name', 'pass4', true, '1');
            admin4 = new User_1.User('email4', 'name', 'pass4', true, '123');
            admin5 = new User_1.User('email6', 'john', 'pass5', true, '456');
            user6 = new User_1.User('email7', 'john', 'pass6');
            ack1 = (UserService_1.UserService.tryRegisterUser(user1));
            ack2 = (UserService_1.UserService.tryRegisterUser(user2));
            ack3 = (UserService_1.UserService.tryRegisterUser(admin3));
            ack4 = (UserService_1.UserService.tryRegisterUser(admin4));
            ack5 = (UserService_1.UserService.tryRegisterUser(admin5));
            ack6 = (UserService_1.UserService.tryRegisterUser(user6));
            expect(ack1).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack2).toEqual(Ack_1.ACK.REGISTER_USER.DUPLICATE_USERNAME);
            expect(ack3).toEqual(Ack_1.ACK.REGISTER_USER.DUPLICATE_USERNAME);
            expect(ack4).toEqual(Ack_1.ACK.REGISTER_USER.DUPLICATE_USERNAME);
            expect(ack5).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack6).toEqual(Ack_1.ACK.REGISTER_USER.DUPLICATE_USERNAME);
            return [2 /*return*/];
        });
    }); });
    it("tells when email and password combination is duplicate", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var user1, user2, user3, user4, admin5, ack1, ack2, ack3, ack4, ack5;
        return tslib_1.__generator(this, function (_a) {
            user1 = new User_1.User('email1', 'name1', 'pass1');
            user2 = new User_1.User('email1', 'name2', 'pass2');
            user3 = new User_1.User('email3', 'name3', 'pass1');
            user4 = new User_1.User('email1', 'name4', 'pass1');
            admin5 = new User_1.User('email1', 'name5', 'pass1', true, '123');
            ack1 = (UserService_1.UserService.tryRegisterUser(user1));
            ack2 = (UserService_1.UserService.tryRegisterUser(user2));
            ack3 = (UserService_1.UserService.tryRegisterUser(user3));
            ack4 = (UserService_1.UserService.tryRegisterUser(user4));
            ack5 = (UserService_1.UserService.tryRegisterUser(admin5));
            expect(ack1).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack2).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack3).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack4).toEqual(Ack_1.ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS);
            expect(ack5).toEqual(Ack_1.ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS);
            return [2 /*return*/];
        });
    }); });
    it("tells when an admin token is invalid", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var user1, admin2, admin3, ack1, ack2, ack3;
        return tslib_1.__generator(this, function (_a) {
            user1 = new User_1.User('email1', 'name1', 'pass1');
            admin2 = new User_1.User('email2', 'name2', 'pass2', true, '123');
            admin3 = new User_1.User('email3', 'name3', 'pass3', true, '789');
            ack1 = (UserService_1.UserService.tryRegisterUser(user1));
            ack2 = (UserService_1.UserService.tryRegisterUser(admin2));
            ack3 = (UserService_1.UserService.tryRegisterUser(admin3));
            expect(ack1).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack2).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            expect(ack3).toEqual(Ack_1.ACK.REGISTER_USER.INVALID_TOKEN);
            return [2 /*return*/];
        });
    }); });
});
describe("UserService's login and logout services", function () {
    afterEach(function () { return UserService_1.UserService._clearRegisteredUsers(); });
    it("tell when a field is missing (login)", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var user1, user2, user3, ack1, ack2, ack3;
        return tslib_1.__generator(this, function (_a) {
            user1 = new User_1.User('email1', '', 'pass1');
            user2 = new User_1.User('', '', 'pass2');
            user3 = new User_1.User('email3', '', 'pass3');
            ack1 = (UserService_1.UserService.tryLoginUser(user1));
            ack2 = (UserService_1.UserService.tryLoginUser(user2));
            ack3 = (UserService_1.UserService.tryLoginUser(user3));
            expect(ack1).toEqual(Ack_1.ACK.LOGIN.USER_NOT_FOUND);
            expect(ack2).toEqual(Ack_1.ACK.LOGIN.MISSING_FIELD);
            expect(ack3).toEqual(Ack_1.ACK.LOGIN.USER_NOT_FOUND);
            return [2 /*return*/];
        });
    }); });
    it("log the correct user from email and password information, and enable logout -> login", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var user1, admin2, userLogin1, adminLogin2, ack1, ack2, ack3, expectedUser1, actualUser1, ack6, expectedUser2, actualUser2;
        return tslib_1.__generator(this, function (_a) {
            user1 = new User_1.User('email1', 'name1', 'pass1');
            admin2 = new User_1.User('email2', 'name2', 'pass2', true, '123');
            userLogin1 = new User_1.User('email1', '', 'pass1');
            adminLogin2 = new User_1.User('email2', '', 'pass2');
            ack1 = (UserService_1.UserService.tryRegisterUser(user1));
            expect(ack1).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            ack2 = (UserService_1.UserService.tryRegisterUser(admin2));
            expect(ack2).toEqual(Ack_1.ACK.REGISTER_USER.OK);
            ack3 = (UserService_1.UserService.tryLoginUser(userLogin1));
            expect(ack3).toEqual(Ack_1.ACK.LOGIN.OK);
            expectedUser1 = user1;
            actualUser1 = ack3.body;
            expect(actualUser1).toEqual(expectedUser1);
            ack6 = (UserService_1.UserService.tryLoginUser(adminLogin2));
            expect(ack6).toEqual(Ack_1.ACK.LOGIN.OK);
            expectedUser2 = admin2;
            actualUser2 = ack6.body;
            expect(actualUser2).toEqual(expectedUser2);
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=UserServiceSpec.js.map