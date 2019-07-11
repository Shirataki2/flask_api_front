import { Context } from "@nuxt/vue-app";

export default function ({store, redirect}: Context) {
    if(!store.state.users.isLoggedIn) {
        redirect('/');
    }
}