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
import { required, maxLength, minLength, email } from 'vuelidate/lib/validators'
import { Validation } from "vuelidate";
import { validateName, validateEmail, validatePassword } from '~/utils/validations'
import { namespace } from "vuex-class";
import * as users from "~/store/users";
const Users = namespace(users.name);
import axios from '~/plugins/axios';


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
      }
    }
  },
})
export default class RegisterDialog extends Vue {
  @Users.Getter user;
  dialog = false;
  registerform = {
    username: "",
    email: "",
    password: ""
  }
  async submit() {
    this.$v.$touch();
    if(this.$v.$pending || this.$v.$error) {
      return;
    }
    try {
      const user = await axios.post(
        'http://localhost:5000/api/register',
        {
          username: this.registerform.username,
          password: this.registerform.password,
          email: this.registerform.email
        }
      )
      console.log(user);
    } catch(err) {
      console.error(err)
    }
    this.clear();
  }
  clear() {
    this.registerform = {
      username: "",
      email: "",
      password: ""
    }
    this.$v.$reset();
    this.dialog = false;
  }
  nameErrors() {
    return validateName(this.$v.registerform!.username)
  }
  emailErrors() {
    return validateEmail(this.$v.registerform!.email)
  }
  passwordErrors() {
    return validatePassword(this.$v.registerform!.password)
  }
}
</script>
