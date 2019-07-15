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
      <v-btn flat v-on="on">Register</v-btn>
    </template>
    <v-card>
      <v-card-title primary-title class="headline">Register to Flask Social!</v-card-title>
      <v-alert :value="errors.length > 0" color="error" icon="warning" outline>
        <v-list v-for="error in errors" :key="error.id">{{ error }}</v-list>
      </v-alert>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-model="registerform.username"
                label="UserName *"
                :counter="32"
                required
                :error-messages="nameErrors()"
                @input="$v.registerform.username.$touch()"
                @blur="$v.registerform.username.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="registerform.email"
                label="E-mail *"
                required
                :error-messages="emailErrors()"
                @input="$v.registerform.email.$touch()"
                @blur="$v.registerform.email.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="registerform.password"
                label="Password *"
                required
                type="password"
                :error-messages="passwordErrors()"
                @input="$v.registerform.password.$touch()"
                @blur="$v.registerform.password.$touch()"
              ></v-text-field>
              <v-text-field
                v-model="registerform.password_confirm"
                label="Password Confirm *"
                required
                type="password"
                :error-messages="passwordConfirmErrors()"
                @input="$v.registerform.password_confirm.$touch()"
                @blur="$v.registerform.password_confirm.$touch()"
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
  email,
  sameAs
} from "vuelidate/lib/validators";
import { Validation } from "vuelidate";
import {
  validateName,
  validateEmail,
  validatePassword,
  validatePasswordConfirm
} from "~/utils/validations";
import { namespace } from "vuex-class";
import * as users from "~/store/users";
const Users = namespace(users.name);
import axios from "~/plugins/axios";

@Component({
  validations: {
    registerform: {
      username: {
        required,
        maxLength: maxLength(32)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      },
      password_confirm: {
        required,
        sameAs: sameAs("password")
      }
    }
  }
})
export default class RegisterDialog extends Vue {
  @Users.Getter user;
  dialog = false;
  registerform = {
    username: "",
    email: "",
    password: "",
    password_confirm: ""
  };
  errors: Array<string> = [];
  async submit() {
    this.$v.$touch();
    if (this.$v.$pending || this.$v.$error) {
      return;
    }
    try {
      const user = await axios.post("/api/register", {
        username: this.registerform.username,
        password: this.registerform.password,
        email: this.registerform.email
      });
      console.log(user);
      this.clear();
    } catch (err) {
      this.errors = []
      switch (err.response.status) {
        case 409:
          this.errors.push(
            "そのユーザ名はすでに使用されています"
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
    this.registerform = {
      username: "",
      email: "",
      password: "",
      password_confirm: ""
    };
    this.$v.$reset();
    this.dialog = false;
  }
  nameErrors() {
    return validateName(this.$v.registerform!.username);
  }
  emailErrors() {
    return validateEmail(this.$v.registerform!.email);
  }
  passwordErrors() {
    return validatePassword(this.$v.registerform!.password);
  }
  passwordConfirmErrors() {
    return validatePasswordConfirm(this.$v.registerform!.password_confirm);
  }
}
</script>
