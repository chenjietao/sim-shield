// import "../test/mock";
import axios from "../lib/axios";

export default {
  checkwaitingmsg(options) {
    return axios.get("/demo/checkwaitingmsg", {
      params: options
    });
  },
  checkbyid(id) {
    return axios.get("/demo/checkbyid", {
      params: {
        id: id
      }
    });
  },
  formsub(data) {
    return axios.post("/demo/formsub", data);
  },
  login(tel) {
    return axios.post("/demo/login", {
      tel: tel
    });
  }
};
