<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="userlist"
      hide-actions
      class="elevation-1"
      pagination.sync="pagination"
      item-key="id"
      loading="true"
    >
    <template v-slot:items="props">
      <td class="text-xs-center">{{ props.item.id }}</td>
      <td class="text-xs-center">{{ props.item.username }}</td>
      <td class="text-xs-center">{{ props.item.email }}</td>
    </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as users from "~/store/users";
import { User } from "types/users_state";
const Users = namespace(users.name);
import axios from '~/plugins/axios';

@Component({
  async asyncData() {
    try {
      const { data } = await axios.get("/api/users");
      let userlist: Array<User> = [];
      (<Array<any>>data["users"]).forEach(user => {
        userlist.push({
          id: user[0].id,
          isLoggedIn: false,
          username: user[0].username,
          email: user[0].email
        });
      });
      return { userlist };
    } catch (err) {
      console.log("user not found")
    }
  }
})
export default class index extends Vue {
  headers = [
    {
      text: "ID",
      align: "center",
      sortable: true,
      value: "id"
    },
    { text: "Name", align: "center", value: "username" },
    { text: "E-mail", align: "center", value: "email" }
  ];
  userlist: Array<User> = [];
}
</script>
