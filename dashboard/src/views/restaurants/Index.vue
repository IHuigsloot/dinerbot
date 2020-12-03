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
          <template v-for="i in restaurants">
            <v-list-item class="py-4 px-8" :key="i" :to="'' + i" append>
              <v-list-item-avatar size="80" rounded="rounded">
                <v-img
                  src="https://media-cdn.tripadvisor.com/media/photo-s/09/5c/46/b0/domino-s-pizza-milnerton.jpg"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content class="ml-4">
                <v-list-item-title class="text-h4"
                  >Domino's pizza's</v-list-item-title
                >
                <v-list-item-subtitle class="text-subtitle-2"
                  >Italiaanse pizza's, Amerikaanse pizza's</v-list-item-subtitle
                >
                <!-- <v-skeleton-loader type="article"></v-skeleton-loader> -->
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon large class="my-2"> mdi-chevron-right </v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider
              v-if="i !== restaurants.length - 1"
              :key="i + 100"
            ></v-divider>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { debounce } from "@/helpers";

export default {
  data: function() {
    return {
      loading: false,
      searchQuery: "",
      restaurants: [0, 1, 2]
    };
  },
  watch: {
    searchQuery: debounce(function(value) {
      this.search(value);
    }, 250)
  },
  methods: {
    search: function(search) {
      console.log(search);
      this.loading = true;

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.loading = false;
      }, 2000);
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
