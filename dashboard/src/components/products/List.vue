<template>
  <v-row justify="center">
    <v-toolbar flat class="mb-2">
      <v-toolbar-title>Producten</v-toolbar-title>
      <v-spacer></v-spacer>
      <New :restaurant="restaurant" @created="add" />
    </v-toolbar>
    <v-expansion-panels popout>
      <v-expansion-panel v-for="product in products" :key="product._id">
        <v-expansion-panel-header
          ><div class="d-flex">
            {{ product.name }}<v-spacer></v-spacer
            ><span class="mr-6">€ {{ product.price }}</span>
          </div></v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <div>
            {{ product.description }}
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="end">
            <Edit
              :restaurant="restaurant"
              :product="product"
              @updated="update"
            />
            <Delete
              :restaurant="restaurant"
              :product="product._id"
              @deleted="remove"
            />
          </div>
        </v-expansion-panel-content>
        <div></div>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
import Delete from "./Delete.vue";
import Edit from "./Edit.vue";
import New from "./New.vue";
import axios from "axios";

export default {
  components: { Edit, Delete, New },
  props: ["restaurant"],
  data: () => ({
    products: [],
    loading: false
  }),

  created() {
    this.loading = true;
    axios
      .get(`http://localhost:3000/restaurants/${this.restaurant}/products`)
      .then(res => (this.products = res.data))
      .catch(err => console.error(err))
      .finally(() => (this.loading = false));
  },

  methods: {
    add(product) {
      this.products.push(product);
    },
    remove(productId) {
      const index = this.products.findIndex(
        product => product._id === productId
      );
      this.products.splice(index, 1);
    },
    update(updatedProduct) {
      const index = this.products.findIndex(
        product => product._id === updatedProduct._id
      );
      Object.assign(this.products[index], updatedProduct);
    }
  }
};
</script>

<style lang="scss" scoped>
.end {
  text-align: end;
}
</style>
