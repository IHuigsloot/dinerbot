<template>
  <v-container v-if="orders._id">
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-card-title>Order informatie</v-card-title>
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
              <v-list-item-title>Naam gebruiker:</v-list-item-title>
              <v-list-item-subtitle>{{ orders.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Email gebruiker:</v-list-item-title>
              <v-list-item-subtitle>{{ orders.user }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Bestemming:</v-list-item-title>
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
              <v-list-item-title>Naam restaurant:</v-list-item-title>
              <v-list-item-subtitle>{{
                orders.restaurant.name
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Aangemaakt op</v-list-item-title>
              <v-list-item-subtitle>{{
                orders.createdAt | formatDate
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card style="height: 100%">
          <line-chart
            style="height: 100%"
            v-if="!!loaded"
            :chart-data="datacollection"
            :options="chartOptions"
          ></line-chart>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Producten</v-card-title>
          <template v-for="(product, index) in orders.products">
            <v-list-item class="py-4 px-8" :key="product._id" append>
              <v-list-item-content>
                <v-list-item-title class="text-h5">{{
                  product.name
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-2"
                  >Hoeveelheid: {{ product.quantity }}, Prijs: €
                  {{ product.price }}</v-list-item-subtitle
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
import axios from "axios";
import moment from "moment";
import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart
  },
  data: function() {
    return {
      loading: false,
      orders: {},
      datacollection: {},
      loaded: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        xAxes: [
          {
            type: "time",
            distribution: "linear",
            time: {
              format: "HH:mm:ss",
              displayFormats: {
                hour: "HH:mm:ss"
              }
            }
          }
        ]
      }
    };
  },

  mounted() {
    this.search();
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
              labels: res.data.temperatureHistory.map(a =>
                moment(a.timestamp).format("HH:mm:ss")
              ),
              datasets: [
                {
                  label: "Temperatuur",
                  backgroundColor: "rgba(248, 121, 121, 0.6)",
                  borderColor: "rgb(248, 121, 121)",
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

canvas {
  box-sizing: initial;
}
</style>
