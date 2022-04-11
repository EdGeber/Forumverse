import { UserService } from '../../src/app/services/user.service'
import { ACK, Ack } from '../../../common/Ack'
import { User } from '../../../common/User';
import { lastValueFrom, of } from 'rxjs';

describe("UserService's registration service", () => {

    it("tells when a user field is missing", async () => {
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

})
