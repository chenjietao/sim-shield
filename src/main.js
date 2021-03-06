import Vue from "vue";
import "typeface-roboto";
import "material-design-icons/iconfont/material-icons.css";
import "muse-ui/lib/styles/base.less";
import {
  Helpers,
  Icon,
  Button,
  List,
  Tabs,
  Form,
  DateInput,
  Select,
  Checkbox,
  Radio,
  Switch,
  TextField,
  LoadMore,
  theme
} from "muse-ui";
import "muse-ui/lib/styles/theme.less";
import Loading from "muse-ui-loading/src/umd";
import Toast from "muse-ui-toast/src/umd";
import Message from "muse-ui-message/src/umd";
import App from "./App.vue";
import router from "./router";
// import "./registerServiceWorker"; // 暂时不使用PWA
import "./lib/eventBus";
import "./lib/axios";

Vue.config.productionTip = false;

Vue.use(Helpers);
Vue.use(Icon);
Vue.use(Button);
Vue.use(List);
Vue.use(Tabs);
Vue.use(Form);
Vue.use(DateInput);
Vue.use(Select);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(TextField);
Vue.use(LoadMore);
theme.use("light");

Vue.use(Loading, {
  overlayColor: "rgba(0, 0, 0, .02)",
  color: "primary",
  size: 32,
  target: document.getElementById("app")
});
Vue.use(Toast);
Vue.use(Message);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
