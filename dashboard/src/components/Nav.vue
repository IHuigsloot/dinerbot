<template>
  <v-app-bar app color="primary" dark>
    <v-btn
      text
      v-for="item in menuItems"
      :key="item.title"
      :to="item.path"
      class="mr-2"
    >
      {{ item.title }}
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { title: "Home", path: "/" },
        { title: "Restaurants", path: "/restaurants" },
        { title: "Robots", path: "/robots" },
        { title: "Orders", path: "/orders" }
      ]
    };
  }
};
</script>
