<template>
  <v-container grid-list-xs>
    <v-flex xs12 row>
      <div v-for="post in posts" :key="post.id">
        <Post :post="post"/>
      </div>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from '~/plugins/axios';
import Post from '~/components/Post.vue';
import { PostProp } from '~/types/types';
import * as users from '~/store/users';
import { namespace } from "vuex-class";
import { Auth } from "../types/users_state";
import { setInterval } from "timers";

const User = namespace(users.name);

@Component({
  components: {
    Post
  },
})
export default class PostList extends Vue {
  @User.Getter auth!:Auth;
  @Prop()
  public url!: string;
  posts: Array<PostProp> = [];
  mounted() {
    this.fetchposts()
  }
  async fetchposts() {
      try {
        const {data} = await axios.post(
          this.url,
          {
            "limit": 5,
            "offset": 0
          },
          {
            headers: {
              Authorization: "Bearer " + this.auth.access_token
            }
          }
        );
        (data.posts as Array<any>).forEach(post => {
          this.posts.push({
            id: post.id,
            uid: post.user_id,
            text: post.text,
            post_at: post.post_at
          })
        })
        console.log(this.posts);
      }catch(err) {
        if(err.response.data.error === 'token_expired') {
          const {data} = await axios.post(
            '/api/refresh',
            {},
            {
              headers: {
                Authorization: "Bearer " + this.auth.refresh_token
              }
            }
          );
          console.log(data);
          this.$store.dispatch('users/setAuth', {
            id: this.auth.id,
            access_token: data.access_token,
            refresh_token: this.auth.refresh_token
          });
          this.fetchposts();
        }
      }
    }
}
</script>
