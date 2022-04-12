import { UserService } from '../../src/app/services/user.service'
import { ACK, Ack } from '../../../common/Ack'
import { User } from '../../../common/User';
import { lastValueFrom, of } from 'rxjs';

// test writing is mostly driven by the possible ack error
// codes each method can raise

describe("UserService's tryRegisterUser", () => {

    afterEach(() => UserService._clearRegisteredUsers());

    it("tells when a user field is missing on the registration", async () => {
        let user1  = new User();  // missing
        let user2  = new User('email2', 'name2', 'pass2');  // full
        let user3  = new User('email3', 'name3'         );  // missing
        let user4  = new User('email4', ''     , 'pass4');  // missing
        let user5  = new User(''      , 'name5', 'pass5');  // missing
        let admin6 = new User('email6', 'name6', 'pass6', true, '123'); // full
        let admin7 = new User('email7', 'name7', 'pass7', true);  // missing

        let ack1 = await lastValueFrom(UserService.tryRegisterUser(user1));
        let ack2 = await lastValueFrom(UserService.tryRegisterUser(user2));
        let ack3 = await lastValueFrom(UserService.tryRegisterUser(user3));
        let ack4 = await lastValueFrom(UserService.tryRegisterUser(user4));
        let ack5 = await lastValueFrom(UserService.tryRegisterUser(user5));
        let ack6 = await lastValueFrom(UserService.tryRegisterUser(admin6));
        let ack7 = await lastValueFrom(UserService.tryRegisterUser(admin7));

        expect(ack1).toEqual(ACK.REGISTER_USER.MISSING_FIELD);
        expect(ack2).toEqual(ACK.REGISTER_USER.OK);
        expect(ack3).toEqual(ACK.REGISTER_USER.MISSING_FIELD);
        expect(ack4).toEqual(ACK.REGISTER_USER.MISSING_FIELD);
        expect(ack5).toEqual(ACK.REGISTER_USER.MISSING_FIELD);
        expect(ack6).toEqual(ACK.REGISTER_USER.OK);
        expect(ack7).toEqual(ACK.REGISTER_USER.MISSING_FIELD);
    });

    it("tells when the username is duplicate", async () => {
        let user1  = new User('email1', 'name', 'pass1');              // not duplicate
        let user2  = new User('email3', 'name', 'pass2');              // duplicate
        let admin3 = new User('email4', 'name', 'pass4', true, '1');   // duplicate
        let admin4 = new User('email4', 'name', 'pass4', true, '123'); // duplicate

        let admin5 = new User('email6', 'john', 'pass5', true, '456'); // not duplicate
        let user6  = new User('email7', 'john', 'pass6');              // duplicate

        let ack1 = await lastValueFrom(UserService.tryRegisterUser(user1));
        let ack2 = await lastValueFrom(UserService.tryRegisterUser(user2));
        let ack3 = await lastValueFrom(UserService.tryRegisterUser(admin3));
        let ack4 = await lastValueFrom(UserService.tryRegisterUser(admin4));
        let ack5 = await lastValueFrom(UserService.tryRegisterUser(admin5));
        let ack6 = await lastValueFrom(UserService.tryRegisterUser(user6));

        expect(ack1).toEqual(ACK.REGISTER_USER.OK);
        expect(ack2).toEqual(ACK.REGISTER_USER.DUPLICATE_USERNAME);
        expect(ack3).toEqual(ACK.REGISTER_USER.DUPLICATE_USERNAME);
        expect(ack4).toEqual(ACK.REGISTER_USER.DUPLICATE_USERNAME);
        expect(ack5).toEqual(ACK.REGISTER_USER.OK);
        expect(ack6).toEqual(ACK.REGISTER_USER.DUPLICATE_USERNAME);
    });

    it("tells when email and password combination is duplicate", async () => {
        let user1  = new User('email1', 'name1', 'pass1');  // ok
        let user2  = new User('email1', 'name2', 'pass2');  // ok
        let user3  = new User('email3', 'name3', 'pass1');  // ok
        let user4  = new User('email1', 'name4', 'pass1');  // duplicate
        let admin5 = new User('email1', 'name5', 'pass1', true, '123'); // duplicate

        let ack1 = await lastValueFrom(UserService.tryRegisterUser(user1));
        let ack2 = await lastValueFrom(UserService.tryRegisterUser(user2));
        let ack3 = await lastValueFrom(UserService.tryRegisterUser(user3));
        let ack4 = await lastValueFrom(UserService.tryRegisterUser(user4));
        let ack5 = await lastValueFrom(UserService.tryRegisterUser(admin5));

        expect(ack1).toEqual(ACK.REGISTER_USER.OK);
        expect(ack2).toEqual(ACK.REGISTER_USER.OK);
        expect(ack3).toEqual(ACK.REGISTER_USER.OK);
        expect(ack4).toEqual(ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS);
        expect(ack5).toEqual(ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS);
    })

    it("tells when an admin token is invalid", async () => {
        let user1  = new User('email1', 'name1', 'pass1');               // ok
        let admin2 = new User('email2', 'name2', 'pass2', true, '123');  // ok
        let admin3 = new User('email3', 'name3', 'pass3', true, '789');  // invalid

        let ack1 = await lastValueFrom(UserService.tryRegisterUser(user1));
        let ack2 = await lastValueFrom(UserService.tryRegisterUser(admin2));
        let ack3 = await lastValueFrom(UserService.tryRegisterUser(admin3));

        expect(ack1).toEqual(ACK.REGISTER_USER.OK);
        expect(ack2).toEqual(ACK.REGISTER_USER.OK);
        expect(ack3).toEqual(ACK.REGISTER_USER.INVALID_TOKEN);
    })
});

describe("UserService's login and logout services", () => {

    afterEach(() => UserService._clearRegisteredUsers());

    it("tell when a field is missing (login)", async () => {
        let user1 = new User('email1', '', 'pass1');  // user not found (ok)
        let user2 = new User('', '', 'pass2');        // missing
        let user3 = new User('email3', '', 'pass3');  // missing

        let ack1 = await lastValueFrom(UserService.tryLoginUser(user1));
        let ack2 = await lastValueFrom(UserService.tryLoginUser(user2));
        let ack3 = await lastValueFrom(UserService.tryLoginUser(user3));

        expect(ack1).toEqual(ACK.LOGIN.USER_NOT_FOUND);
        expect(ack2).toEqual(ACK.LOGIN.MISSING_FIELD);
        expect(ack3).toEqual(ACK.LOGIN.USER_NOT_FOUND);
    });

    it("log the correct user from email and password information, and enable logout -> login", async () => {
        let user1  = new User('email1', 'name1', 'pass1');  // register ok
        let admin2 = new User('email2', 'name2', 'pass2', true, '123');  // register ok
        let userLogin1  = new User('email1', '', 'pass1');   // login ok, return user1
        let adminLogin2 = new User('email2', '', 'pass2');   // login ok, return admin2

        let ack1 = await lastValueFrom(UserService.tryRegisterUser(user1));
        expect(ack1).toEqual(ACK.REGISTER_USER.OK);

        let ack2 = await lastValueFrom(UserService.tryRegisterUser(admin2));
        expect(ack2).toEqual(ACK.REGISTER_USER.OK);

        let ack3 = await lastValueFrom(UserService.tryLoginUser(userLogin1));
        expect(ack3).toEqual(ACK.LOGIN.OK);

        let expectedAck4 = ACK.GET_LOGGED_USER.OK;
        expectedAck4.body = user1;
        let ack4 = await lastValueFrom(UserService.loggedUser);
        expect(ack4).toEqual(expectedAck4);

        let ack5 = await lastValueFrom(UserService.tryLogoutUser());
        expect(ack5).toEqual(ACK.LOGOUT.OK);


        let ack6 = await lastValueFrom(UserService.tryLoginUser(adminLogin2));
        expect(ack6).toEqual(ACK.LOGIN.OK);

        let expectedAck7 = ACK.GET_LOGGED_USER.OK;
        expectedAck7.body = admin2;
        let ack7 = await lastValueFrom(UserService.loggedUser);
        expect(ack7).toEqual(expectedAck7);

        let ack8 = await lastValueFrom(UserService.tryLogoutUser());
        expect(ack8).toEqual(ACK.LOGOUT.OK);

    })
})
