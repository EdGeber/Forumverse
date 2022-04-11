import { User } from "./User";
import { Thread } from "./Thread";

export interface ErrorHandlers { [index: number]: () => void }

export class Ack<T = void> {  // the void makes the type parameter optional
    constructor(public src: string, public code: number, public body?: T) {}
}

export const ACK = {
    OK: 0,

    REGISTER_USER: { // 1 to 99
        OK:                       new Ack("registerUser", 0),
        MISSING_FIELD:            new Ack("registerUser", 1),
        DUPLICATE_USERNAME:       new Ack("registerUser", 2),
        INVALID_TOKEN:            new Ack("registerUser", 3),
        DUPLICATE_EMAIL_AND_PASS: new Ack("registerUser", 4),
    },

    GET_LOGGED_USER: {
        OK: new Ack<User|null>("getLoggedUser", 0),
    },

    GET_THREAD:{
        OK: new Ack<Thread|undefined>("getThread",0),
    },

    CREATE_THREAD: { 
        // 200 to 249: THREAD CREATION
        OK:                     new Ack("Thread", 0),
        MISSING_NAMEFIELD:      new Ack("Thread", 200),
        MISSING_TOPICFIELD:     new Ack("Thread", 201),
        DUPLICATE_THREADNAME:   new Ack("Thread", 202),

        //250 to 299: THREAD OPERATIONS
        EMPTY_REPLY_MSG:      new Ack('Thread',250),
        UNEXPECTED_ERROR:     new Ack('Thread',251)
    },

    LOGIN: { // 300 to 399
        OK:             new Ack("login", 0),
        MISSING_FIELD:  new Ack("login", 301),
        USER_NOT_FOUND: new Ack("login", 302)
    }
}