<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mr-2" color="primary" dark v-bind="attrs" v-on="on">
        Nieuw product
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Nieuw product</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field
                label="Naam"
                required
                v-model="product.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Prijs"
                required
                type="number"
                v-model="product.price"
              ></v-text-field>
            </v-col>
            <v-col cols="8" sm="8">
              <v-text-field
                label="Tijd om te maken (in seconden)"
                required
                type="number"
                v-model="product.preperationTime"
              ></v-text-field>
            </v-col>
            <v-col cols="4" sm="4">
              <span>Omgerekende tijd</span>
              <p>{{ preperationTimeCalculated }}</p>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field
                label="Omschrijving"
                required
                v-model="product.description"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false"> Annuleren </v-btn>
        <v-btn color="primary" text @click="save"> Opslaan </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: ["restaurant"],
  data() {
    return {
      dialog: false,
      product: {
        name: "",
        price: 0,
        description: "",
        preperationTime: 0
      }
    };
  },
  computed: {
    preperationTimeCalculated() {
      if (this.product?.preperationTime) {
        const time = new Date(this.product?.preperationTime * 1000)
          .toISOString()
          .substr(14, 5);
        return time;
      }
      return "00:00";
    }
  },
  methods: {
    save() {
      const { name, price, description, preperationTime } = this.product;
      axios
        .post(`http://localhost:3000/restaurants/${this.restaurant}/products`, {
          name,
          price,
          description,
          preperationTime
        })
        .then(res => {
          this.$emit("created", res.data);
          this.dialog = false;

          for (const prop of Object.getOwnPropertyNames(this.product)) {
            // Clear product model
            delete this.product[prop];
          }
        });
    }
  }
};
</script>
