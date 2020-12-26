<template>
  <v-row justify="center">
    <v-toolbar flat class="mb-2">
      <v-toolbar-title>Producten</v-toolbar-title>
      <v-spacer></v-spacer>
      <New />
    </v-toolbar>
    <v-expansion-panels popout>
      <v-expansion-panel v-for="(item, i) in 5" :key="i">
        <v-expansion-panel-header>Item</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </div>
          <v-divider class="my-2"></v-divider>
          <div class="end">
            <Edit />
            <Delete />
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
import New from './New.vue';
export default {
  components: { Edit, Delete, New },
}
</script>

<style lang="scss" scoped>
.end {
  text-align: end;
}
</style>
