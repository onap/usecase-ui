import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "view-design/dist/styles/iview.css";
import { Menu, Button, MenuItem, MenuGroup, Icon, Submenu } from "view-design";
import { address, menu } from "@/const/index.js";

Vue.component("Menu", Menu);
Vue.component("Button", Button);
Vue.component("MenuGroup", MenuGroup);
Vue.component("MenuItem", MenuItem);
Vue.component("Icon", Icon);
Vue.component("Submenu", Submenu);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// Routing global guard
// Before each route jump, it needs to judge whether it belongs to this project or not. If not, it will jump to other projects
router.beforeEach((to, from, next) => {
  const target = to.path;
  const route = router.options.routes;
  const result = route.find(item => {
    return item.path === target;
  });
  if (typeof result === "undefined") {
    // looking fro the source of this path
    const menuList = menu.MENU_ITEM;
    let source = null;
    for (let item of menuList) {
      if (item.path === target) {
        source = item.source;
      } else {
        for (let val of item.children) {
          if (val.path === target) {
            source = val.source;
          }
        }
      }
    }
    if (source === null) {
      console.log(
        "The source of the path is not recorded in the routing table"
      );
    } else {
      const targetServer = address.ADDRESS[source];
      let newUrl = "";
      if (process.env.NODE_ENV === "development") {
        // dev
        console.log(address.MAIN_SOURCE);
        newUrl = `${targetServer}#${target}`;
      } else {
        let baseUrl = window.location.href.split("#")[0];
        if (source === address.MAIN_SOURCE) {
          // If the target is the main project
          baseUrl = `${baseUrl.split(address.SELF_SOURCE)[0]}`;
          newUrl = `${baseUrl}#${target}`;
        } else {
          // If the target is another subproject
          baseUrl = `${baseUrl.split(address.SELF_SOURCE)[0]}${source}/`;
          newUrl = `${baseUrl}#${target}`;
        }
      }
      console.log("new", newUrl);
      window.location.href = newUrl;
    }
  } else {
    next();
  }
});
