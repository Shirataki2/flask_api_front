<template>
  <v-app dark>
    <Header></Header>
    <PostIcon/>
    <nuxt/>
    <v-footer fixed class="pa-3">
      <v-spacer></v-spacer>
      <div>&copy; 2019</div>
    </v-footer>
  </v-app>
</template>

<script>
import {Component, Vue} from "vue-property-decorator";
import Header from "~/components/Header.vue";
import PostIcon from "~/components/PostIcon.vue";
import * as users from '~/store/users';
@Component({
  components: {
    Header,
    PostIcon
  }
})
export default class Layout extends Vue {}
</script>
