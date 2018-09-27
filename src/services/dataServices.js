// import "../test/mock";
import axios from "../lib/axios";

export default {
  checkwaitingmsg(options) {
    // 点击查看待审批列表
    return axios.get("/demo/checkwaitingmsg", {
      params: options
    });
  },
  checkbyid(id) {
    // 点击某一个待审批合同，返回该合同详细信息
    return axios.get("/demo/checkbyid", {
      params: {
        id: id
      }
    });
  },
  formsub(data) {
    // 工作台提交保存合同表单数据时调用
    return axios.post("/demo/formsub", data);
  },
  login(tel) {
    // 工作台进入应用页面项时调用，保存用户信息到session
    return axios.post("/demo/login", {
      tel: tel
    });
  },
  checkforca(options) {
    // 查看当前用户是否拥有CA证书
    return axios.get("/demo/checkforca", {
      params: options
    });
  },
  applica(options) {
    // 申请CA证书
    return axios.get("/demo/applica", {
      params: options
    });
  },
  sign(options) {
    // 进行SIM盾签名
    return axios.get("/demo/sign", {
      params: options
    });
  },
  approvebyid(id, comment) {
    // 审批功能
    return axios.post("/demo/approvebyid", {
      id: id,
      comment: comment
    });
  }
};
