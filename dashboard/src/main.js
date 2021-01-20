import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import moment from "moment";

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("DD/MM/YYYY hh:mm");
  }
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
