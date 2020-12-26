<template>
  <v-dialog v-model="dialog" max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red" dark v-bind="attrs" v-on="on"> Verwijderen </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline"> Product verwijderen? </v-card-title>
      <v-card-text
        >Weet je zeker dat je {{ "Product" }} wilt verwijderen? Deze actie kan
        niet ongedaan worden.</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false">
          Annuleren
        </v-btn>
        <v-btn color="red darken-1" text @click="dialog = false">
          verwijderen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
};
</script>