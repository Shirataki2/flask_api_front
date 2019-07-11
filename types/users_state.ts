export interface User {
    id?: number;
    isLoggedIn: boolean;
    username: string;
    email?: string;
}
export interface Auth {
    id: number;
    access_token: string;
    refresh_token: string;
}
export class UserClass implements User {
    id?: number;
    isLoggedIn: boolean;
    username: string;
    email?: string;
    constructor(isLoggedIn: boolean, username: string, id?: number,  email?: string) {
        this.id = id;
        this.isLoggedIn = isLoggedIn;
        this.username = username;
        this.email = email;
    }
}
export class AuthClass implements Auth {
    id: number;
    access_token: string;
    refresh_token: string;
    constructor(id: number, access_token: string, refresh_token: string) {
        this.id = id;
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }
}
export interface UserState {
    user: User,
    auth: Auth
}
