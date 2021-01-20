<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Order ID:</v-list-item-title>
              <v-list-item-subtitle>{{
                $route.params.id
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Order name:</v-list-item-title>
              <v-list-item-subtitle>{{ orders.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>User:</v-list-item-title>
              <v-list-item-subtitle>{{ orders.user }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Destination:</v-list-item-title>
              <v-list-item-subtitle>{{
                orders.destination
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Status:</v-list-item-title>
              <v-list-item-subtitle>{{ orders.status }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Restaurant ID:</v-list-item-title>
              <v-list-item-subtitle>{{
                orders.restaurant._id
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Restaurant name:</v-list-item-title>
              <v-list-item-subtitle>{{
                orders.restaurant.name
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Created at:</v-list-item-title>
              <v-list-item-subtitle>{{
                orders.createdAt
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <line-chart v-if="!!loaded" :chart-data="datacollection"></line-chart>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <h2>Products:</h2>
          <template v-for="(product, index) in orders.products">
            <v-list-item class="py-4 px-8" :key="product._id" append>
              <v-list-item-content class="ml-4">
                <v-list-item-title class="text-h5">{{
                  product.name
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-2"
                  >Quantity: {{ product.quantity }}, Price:
                  {{ product.price }}$</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider
              v-if="index !== orders.products.length - 1"
              :key="product._id + 10"
            ></v-divider>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { debounce } from "@/helpers";
import axios from "axios";
import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart
  },
  data: function() {
    return {
      loading: false,
      searchQuery: "",
      orders: {},
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
    search: function() {
      this.loading = true;

      axios
        .get("http://localhost:3000/orders/" + this.$route.params.id, {
          headers: { user: "admin" }
        })
        .then(
          res => (
            (this.orders = res.data),
            (this.datacollection = {
              labels: res.data.temperatureHistory.map(
                a => a.timestamp.split("T")[1]
              ),
              datasets: [
                {
                  label: "Temperature",
                  backgroundColor: "#f87979",
                  lineTension: 0.25,
                  data: res.data.temperatureHistory.map(a => a.temperature)
                }
              ]
            })
          )
        )
        .catch(err => console.error(err))
        .finally(() => ((this.loading = false), console.log(this.orders)));
    },
    showData: function() {
      console.log(this.orders);
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
