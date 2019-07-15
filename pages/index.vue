<template>
  <div>
    <v-container grid-list-xs>
      <v-layout row wrap>
        <v-flex sm4></v-flex>
        <v-flex xs12 sm8 offset-sm4>
          <PostList v-if="user.isLoggedIn" url="/api/posts" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import PostList from "~/components/PostList.vue";
import { User } from "~/types/users_state";
import * as users from "~/store/users";
import { namespace } from "vuex-class";

const User = namespace(users.name);

@Component({
  components: {
    PostList
  }
})
export default class index extends Vue {
  @User.Getter user!: User;
  dbg = "DEBUG";
  mounted() {
    console.log(this);
  }
}
</script>
