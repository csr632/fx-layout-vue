import Vue from "vue";
import Router from "vue-router";
import Example1 from "./components/Example1.vue";
import Example2 from "./components/Example2.vue";
import Example3 from "./components/Example3.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/example1",
      name: "example1",
      component: Example1
    },
    {
      path: "/example2",
      name: "example2",
      component: Example2
    },
    {
      path: "/example3",
      name: "example3",
      component: Example3
    }
  ],
  mode: "history"
});
