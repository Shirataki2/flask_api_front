<template>
  <v-menu offset-y>
    <v-btn flat dark slot="activator">Login as {{ user.username }}</v-btn>
    <v-list>
      <v-list-tile @click="logout">
        <v-list-tile-title>
          Log out
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as users from "~/store/users";
import axios from '~/plugins/axios';
import { User, Auth, AuthClass, UserClass } from "~/types/users_state";
const Users = namespace(users.name);
@Component
export default class UserMenu extends Vue {
  @Users.Getter user!:User;
  @Users.Getter auth!:Auth;
  async logout() {
    try {
      const refresh_token = this.auth.refresh_token;
      const {data} = await axios.post('/api/logout', {}, {
        headers: { Authorization: "Bearer " + refresh_token }
      })
      this.$store.dispatch('users/setAuth', new AuthClass(0, '', ''));
      this.$store.dispatch('users/setUser', new UserClass(false, '', 0, ''))
    }catch (err) {
      console.log(err);
    }
  }
}
</script>
