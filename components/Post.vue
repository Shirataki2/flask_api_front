<template>
  <div>
    <v-card class="mb-1 pb-2">
      <v-card-title secondary>
        <v-btn icon color="blue lighten-3">
          <v-icon>edit</v-icon>
        </v-btn>
        <h2 class="heading">{{ name }}</h2>
        <v-spacer></v-spacer>
        <p class="grey--text mt-3">{{ date }}</p>
      </v-card-title>
      <v-card-text v-html="$sanitize(post.text.replace(/\n/g, '<br/>'))">
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from '~/plugins/axios';
import { PostProp } from "../types/types";
import date2str from '~/utils/format_date';
@Component
export default class Post extends Vue {
  @Prop() public post!:PostProp;
  name = ' ';
  date = ' ';
  async mounted() {
    const {data} = await axios.get(`/api/user/${this.post.uid}`)
    this.name = data.username;
    this.date = date2str(this.post.post_at);
  }
}
</script>
