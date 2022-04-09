import { User } from "./User";

export interface ErrorHandlers { [index: number]: () => void }

export class Ack<T = void> {  // the void makes the type parameter optional
    constructor(public src: string, public code: number, public body?: T) {}
}

export const ACK = {
    OK: 0,

    REGISTER_USER: { // 1 to 99
        OK:                 new Ack("logIN", 0),
        MISSING_FIELD:      new Ack("logIN", 1),
        DUPLICATE_USERNAME: new Ack("logIN", 2),
    },

    GET_LOGGED_USER: {
        OK: new Ack<User|null>("getLoggedUser", 0),
    }
}
