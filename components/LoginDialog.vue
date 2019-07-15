<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn flat v-on="on">Login</v-btn>
    </template>
    <v-card>
      <v-card-title primary-title class="headline">Login to Flask Social!</v-card-title>
      <v-alert v-if="errors.length > 0" :value="true" color="error" icon="warning" outline>
        <v-list v-for="error in errors" :key="error.text">{{ error }}</v-list>
      </v-alert>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-model="loginform.username"
                label="UserName *"
                required
                :error-messages="nameErrors()"
                @input="$v.loginform.username.$touch()"
                @blur="$v.loginform.username.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="loginform.password"
                label="Password *"
                required
                type="password"
                :error-messages="passwordErrors()"
                @input="$v.loginform.password.$touch()"
                @blur="$v.loginform.password.$touch()"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="submit">submit</v-btn>
          <v-btn color="primary" flat @click="clear">clear</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import {
  required,
  maxLength,
  minLength,
  email
} from "vuelidate/lib/validators";
import { Validation } from "vuelidate";
import {
  validateName,
  validateEmail,
  validatePassword
} from "~/utils/validations";
import { namespace } from "vuex-class";
import { UserClass } from "~/types/users_state";
import Cookie from "js-cookie";
import * as users from "~/store/users";
const Users = namespace(users.name);
import axios from "~/plugins/axios";

@Component({
  validations: {
    loginform: {
      username: {
        required
      },
      password: {
        required
      }
    }
  }
})
export default class LoginDialog extends Vue {
  @Users.Getter user;
  dialog = false;
  loginform = {
    username: "",
    password: ""
  };
  errors: Array<string> = [];
  async submit() {
    this.$v.$touch();
    if (this.$v.$pending || this.$v.$error) {
      return;
    }
    try {
      const { data } = await axios.post("/api/login", {
        username: this.loginform.username,
        password: this.loginform.password
      });
      const user = new UserClass(true, this.loginform.username, data.id);
      this.$store.dispatch("users/setUser", user);
      this.$store.dispatch("users/setAuth", data);
      this.clear();
    } catch (err) {
      switch (err.response.status) {
        case 401:
          this.errors.push(
            "ユーザ名またはパスワードが一致しないか，ユーザが存在しません"
          );
          break;
        case 500:
          this.errors.push(
            "サーバ内部のエラーです．管理者に問い合わせてください．"
          );
          break;
        default:
          this.errors.push("不明なエラーです:" + err.response.statusText);
          break;
      }
    }
  }
  clear() {
    this.loginform = {
      username: "",
      password: ""
    };
    this.$v.$reset();
    this.dialog = false;
  }
  nameErrors() {
    return validateName(this.$v.loginform!.username);
  }
  passwordErrors() {
    return validatePassword(this.$v.loginform!.password);
  }
}
</script>
