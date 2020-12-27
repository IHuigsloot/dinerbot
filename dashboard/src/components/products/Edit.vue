<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mr-2" color="primary" dark v-bind="attrs" v-on="on">
        Bewerken
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Product bewerken</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field
                label="Naam"
                required
                v-model="productCopy.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Prijs"
                required
                type="number"
                v-model="productCopy.price"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field
                label="Omschrijving"
                required
                v-model="productCopy.description"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="save"> Opslaan </v-btn>
        <v-btn color="primary" text @click="dialog = false"> Annuleren </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: ["restaurant", "product"],
  data() {
    return {
      dialog: false,
      productCopy: {
        _id: null,
        name: "",
        price: 0,
        description: ""
      }
    };
  },
  created() {
    this.productCopy = Object.assign({}, this.product);
  },
  methods: {
    save() {
      const { _id, name, price, description } = this.productCopy;
      axios
        .put(
          `http://localhost:3000/restaurants/${this.restaurant}/products/${_id}`,
          {
            name,
            price,
            description
          }
        )
        .then(res => {
          this.$emit("updated", res.data);
          this.dialog = false;
        });
    }
  }
};
</script>
