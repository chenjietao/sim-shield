import Vue from "vue";
import axios from "axios";
import qs from "qs";

if (!window.$axios) {
  if (window.$reqestingCount == null) {
    // 记录未完成的请求数
    window.$reqestingCount = 0;
  }

  let showLoading = () => {
    if (window.$reqestingCount <= 0) {
      // 显示loading
      if (window.$museUILoading == null) {
        window.$museUILoading = window.$eventBus.$loading();
      }
    }
  };

  let hideLoading = () => {
    if (window.$reqestingCount <= 0) {
      // 隐藏loading
      if (window.$museUILoading != null) {
        window.$museUILoading.close();
        window.$museUILoading = null;
      }
    }
  };

  let instance = axios.create({
    timeout: 30000
  });

  if (process.env.NODE_ENV === "production") {
    instance.defaults.baseURL = "http://localhost:8081"; // 生产环境api地址前缀
  } else {
    instance.defaults.baseURL = "http://localhost:8081";
  }

  instance.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

  instance.defaults.transformRequest = data => {
    // 请求参数转换
    if (typeof data === "object") {
      return qs.stringify(data);
    }
    return data;
  };

  instance.interceptors.request.use(
    config => {
      // before send
      showLoading();
      window.$reqestingCount += 1;

      if (config.url.indexOf("/login") > -1) {
        // 登录请求不拦截
        return config;
      } else if (window.$eventBus.logined) {
        // 已登录之后的请求不拦截
        return config;
      } else {
        // 未登录时各请求需要等待登录以后再发送
        return new Promise((resolve, reject) => {
          let times = 0;
          let timer = setInterval(() => {
            times++;
            if (window.$eventBus.logined) {
              clearInterval(timer);
              resolve(config);
            } else if (times > 500) {
              clearInterval(timer);
              reject(config);
            }
          }, 10);
        });
      }
    },
    error => {
      // request eror
      window.$reqestingCount -= 1;
      hideLoading();
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => {
      // sucess
      window.$reqestingCount -= 1;
      hideLoading();
      try {
        response = JSON.parse(response);
      } catch (e) {
        // do nothing
      }
      return response;
    },
    error => {
      // fail
      window.$reqestingCount -= 1;
      hideLoading();
      return Promise.reject(error);
    }
  );

  window.$axios = instance;
  Vue.prototype.$axios = instance;
}

export default window.$axios;
