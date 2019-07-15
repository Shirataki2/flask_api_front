<template>
  <div v-if="user.isLoggedIn">
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="700px"
      transition="dialog-transition"
    >
      <template v-slot:activator="{ on }">
        <v-fab-transition>
          <v-btn
            name="edit"
            aria-label="投稿"
            large fixed bottom
            dark fab left
            icon class="mb-5 mr-4"
            color="primary" v-on="on"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <v-card class="rounded-2">
        <v-card-title class="headline" primary-title>今起きてることを共有しよう</v-card-title>
        <v-alert :value="errors.length > 0" color="error" icon="warning" outline>
          <v-list v-for="error in errors" :key="error.id">{{ error }}</v-list>
        </v-alert>
        <v-textarea
          class="pa-3 rounded-2"
          name="text"
          label="現況報告！"
          height="20ch"
          v-model="text"
          :counter="maximumLength"
          outline
        ></v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-progress-circular :value="percent()" rotate="-90" :color="getColor()"></v-progress-circular>
          <v-btn color="primary" flat @click="cancel()">キャンセル</v-btn>
          <v-btn color="primary" flat @click="submit()" :disabled="isinvalid()">投稿</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="success" v-model="snackbar" bottom left>
      正常に投稿しました．
      <v-btn dark flat @click.native="snackbar = false">OK</v-btn>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as users from "~/store/users";
import { namespace } from "vuex-class";
import { User, Auth } from "~/types/users_state";
import axios from "~/plugins/axios";
const User = namespace(users.name);
@Component({})
export default class PostIcon extends Vue {
  @User.Getter user!: User;
  @User.Getter auth!: Auth;
  dialog = false;
  snackbar = false;
  fetched = false;
  text: string = "";
  maximumLength: number = 50;
  errors: Array<string> = [];
  percent() {
    return (this.text.length / this.maximumLength) * 100;
  }
  isinvalid() {
    return this.percent() > 100 || this.text.trim() === "";
  }
  getColor() {
    let p = this.percent() / 100;
    if (p < 0.5) return "blue";
    if (p < 0.75) return "green";
    if (p < 0.9) return "yellow";
    if (p <= 1) return "orange";
    return "error";
  }
  async submit() {
    try {
      const { data } = await axios.post(
        "/api/submit",
        {
          text: this.text
        },
        {
          headers: {
            Authorization: "Bearer " + this.auth.access_token
          }
        }
      );
      this.snackbar = true;
      this.cancel();
      this.errors = [];
    } catch (err) {
      if (err.response.status === 401) {
        const { data } = await axios.post(
          "/api/refresh",
          {},
          {
            headers: {
              Authorization: "Bearer " + this.auth.refresh_token
            }
          }
        );
        console.log(data);
        await this.$store.dispatch("users/setAuth", {
          id: this.auth.id,
          access_token: data.access_token,
          refresh_token: this.auth.refresh_token
        });
        if (!this.fetched) {
          this.fetched = !this.fetched;
          this.submit();
        }
      }
      this.errors = [];
      switch (err.response.status) {
        case 401:
          this.errors.push(
            "トークンの有効期限が切れています！再ログインをしてください"
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
  cancel() {
    this.dialog = false;
    this.text = "";
  }
}
</script>
