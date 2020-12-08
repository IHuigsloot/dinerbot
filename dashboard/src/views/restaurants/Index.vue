<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <v-text-field
          label="Restaurants zoeken"
          prepend-icon="mdi-briefcase-search"
          v-model="searchQuery"
        >
          <template v-slot:append>
            <v-progress-circular
              v-if="loading"
              size="18"
              width="2"
              indeterminate
            ></v-progress-circular>
          </template>
        </v-text-field>
      </v-col>
      <v-col align-self="center" cols="3">
        <v-row justify="end" :dense="true">
          <v-btn color="primary" to="new" append>Nieuw restaurant</v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <template v-for="(restaurant, index) in restaurants">
            <v-list-item
              class="py-4 px-8"
              :key="restaurant._id"
              :to="'' + restaurant._id"
              append
            >
              <v-list-item-avatar size="80" rounded="rounded">
                <v-img
                  :src="`http://localhost:3000/restaurants/${restaurant._id}/logo`"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content class="ml-4">
                <v-list-item-title class="text-h4">{{
                  restaurant.name
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-subtitle-2"
                  ><span v-for="tag in restaurant.tags" :key="tag">{{ tag }}, </span></v-list-item-subtitle
                >
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon large class="my-2"> mdi-chevron-right </v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider
              v-if="index !== restaurants.length - 1"
              :key="restaurant._id + 10"
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

export default {
  data: function() {
    return {
      loading: false,
      searchQuery: "",
      restaurants: null
    };
  },

  watch: {
    searchQuery: debounce(function(value) {
      this.search(value);
    }, 250)
  },

  mounted() {
    this.search("");
  },

  methods: {
    search: function(search) {
      console.log(search);
      this.loading = true;

      axios
        .get("http://localhost:3000/restaurants")
        .then(res => (this.restaurants = res.data))
        .catch(err => console.error(err))
        .finally(() => (this.loading = false));
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
