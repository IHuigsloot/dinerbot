import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routerOptions = [
  { path: "/", component: "Home" },
  { path: "/restaurants", component: "restaurants/Index" },
  { path: "/restaurants/new", component: "restaurants/View" },
  { path: "/restaurants/:id", component: "restaurants/View" },
  { path: "/robots", component: "Robots" },
  { path: "/orders", component: "orders/Index" },
  { path: "/orders/:id", component: "orders/View" }
];

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`../views/${route.component}.vue`)
  };
});

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
