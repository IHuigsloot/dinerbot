<template>
  <v-container>
    <h1>Orders:</h1>
    <v-data-table
      :headers="headers"
      :items="orders"
      :items-per-page="10"
      class="elevation-1"
      @click:row="handleClick"
    ></v-data-table>
  </v-container>
</template>

<script>
import { debounce } from "@/helpers";
import axios from "axios";

export default {
  data: function() {
    return {
      headers: [
        {
          text: "Order ID",
          align: "start",
          sortable: false,
          value: "_id"
        },
        { text: "Name", value: "name" },
        { text: "Status", value: "status" },
        { text: "Restaurant", value: "restaurant.name" }
      ],
      loading: false,
      searchQuery: "",
      orders: [],
      datacollection: {},
      loaded: false
    };
  },

  watch: {
    searchQuery: debounce(function(value) {
      this.search(value);
    }, 250)
  },

  mounted() {
    this.search("");
    this.loaded = true;
  },

  methods: {
    search: function(search) {
      console.log(search);
      this.loading = true;

      axios
        .get("http://localhost:3000/orders", { headers: { user: "admin" } })
        .then(res => (this.orders = res.data))
        .catch(err => console.error(err))
        .finally(() => ((this.loading = false), console.log(this.orders)));
    },
    handleClick(value) {
      window.location.href = "/orders/" + value._id; //relative to domain
    }
  }
};
</script>

<style lang="scss" scoped>
.v-list-item:hover {
  .v-icon {
    transform: translateX(10px);
  }
}
</style>
