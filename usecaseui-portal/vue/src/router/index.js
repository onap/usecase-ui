import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

// Different from angular, this route only needs to include the route in this project

const routes = [
  {
    path: "/vueHome",
    name: "vueHome",
    component: Home
  },
  {
    path: "/test",
    name: "Test",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Test.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
