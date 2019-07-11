<template>
  <v-toolbar color="primary" dark>
    <v-toolbar-title>Flask Social</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <RegisterDialog v-if="!user.isLoggedIn" />
      <LoginDialog v-if="!user.isLoggedIn" />
      <UserMenu v-if="user.isLoggedIn" />
    </v-toolbar-items>
  </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as users from "~/store/users";
import LoginDialog from '~/components/LoginDialog.vue'
import RegisterDialog from '~/components/RegisterDialog.vue';
import UserMenu from '~/components/UserMenu.vue';
const Users = namespace(users.name);
@Component({
  components: {
    LoginDialog,
    RegisterDialog,
    UserMenu
  }
})
export default class Header extends Vue {
  @Users.Getter user;
}
</script>
