<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import clientServices from "./services/clientServices";
import dataServices from "./services/dataServices";

export default {
  data() {
    return {};
  },
  created() {
    clientServices.getEnterpriseContact(info => {
      let loginUserInfo = info[0];
      window.$eventBus.loginUserInfo = loginUserInfo;
      dataServices.login(loginUserInfo.phone).then(resp => {
        window.$eventBus.logined = true;
        window.$eventBus.loginTel = loginUserInfo.phone;
      });
    });
  }
};
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
