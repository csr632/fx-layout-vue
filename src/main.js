import Vue from 'vue'
import App from './App.vue'
import FxLayout from "fx-layout-vue";

Vue.config.productionTip = false

Vue.use(FxLayout);

new Vue({
  render: h => h(App)
}).$mount('#app')
