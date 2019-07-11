<template>
  <v-app dark>
    <Header></Header>
    <nuxt/>
  </v-app>
</template>

<script>
import {Component, Vue} from "vue-property-decorator";
import Header from "~/components/Header.vue";
import * as users from '~/store/users';
@Component({
  components: {
    Header
  }
})
export default class Layout extends Vue {}
</script>
