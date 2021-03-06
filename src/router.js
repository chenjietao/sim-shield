import Vue from "vue";
import Router from "vue-router";
import List from "./views/List.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: {
        name: "list"
      }
    },
    {
      path: "/list",
      name: "list",
      component: List
    },
    {
      path: "/details/:id",
      name: "details",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "details" */ "./views/Details.vue")
    },
    {
      path: "/create",
      name: "create",
      component: () => import("./views/Details.vue")
    },
    {
      path: "/sdk-list",
      name: "sdk-list",
      component: List
    },
    {
      path: "/sdk-details/:id",
      name: "sdk-details",
      component: () => import("./views/Details.vue")
    },
    {
      path: "/sdk-create",
      name: "sdk-create",
      component: () => import("./views/Details.vue")
    }
  ]
});
