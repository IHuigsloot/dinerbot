<template>
  <v-app>
    <Nav />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Nav from "./components/Nav";

export default {
  name: "App",

  components: {
    Nav
  },

  data: () => ({
    //
  })
};
</script>

<style lang="scss">
// Max width of container
.container {
  max-width: 1080px;
}
</style>
