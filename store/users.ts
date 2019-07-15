import { RootState } from '@/types/root_state';
import { GetterTree, ActionTree, ActionContext, MutationTree } from 'vuex';
import { User, UserClass, UserState, Auth, AuthClass } from '@/types/users_state'
export const name = 'users';

export const state = (): UserState => ({
    user: new UserClass(false, '', 0, ''),
    auth: new AuthClass(0, '', '')
})

export const getters: GetterTree<UserState, RootState> = {
    user: state => {
        return state.user;
    },
    auth: state => {
        return state.auth;
    }
}

export const types = {
    SETUSER: 'users/setUser',
    SETAUTH: 'users/setAuth'
}

export interface Actions<S, R> extends ActionTree<S, R> {
    setUser(context: ActionContext<S, R>, document): void
    setAuth(context: ActionContext<S, R>, document): void
}

export const actions: Actions<UserState, RootState> = {
    setUser({ commit }, user: User): void {
        commit(types.SETUSER, user);
    },
    setAuth({ commit }, auth: Auth): void {
        commit(types.SETAUTH, auth);
    },
}

export const mutations: MutationTree<UserState> = {
    [types.SETUSER](state, user: User) {
        state.user = user;
    },
    [types.SETAUTH](state, auth: Auth) {
        state.auth = auth;
    }
}