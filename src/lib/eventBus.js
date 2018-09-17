import Vue from "vue";

// 全局Vue实例，用于存储各组件通用的数据，如当前用户信息
if (!window.$eventBus) {
  window.$eventBus = new Vue();
  Vue.prototype.$eventBus = window.$eventBus;
}

export default window.$eventBus;
