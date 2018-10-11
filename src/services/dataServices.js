// import "../test/mock";
import axios from "../lib/axios";

export default {
  checkwaitingmsg(tel) {
    // 点击查看待审批列表
    return axios.post("/demo/checkwaitingmsg", {
      approverTell: tel
    });
  },
  checkbyid(id, tel) {
    // 点击某一个待审批合同，返回该合同详细信息
    return axios.post("/demo/checkbyid", {
      contractId: id,
      approverTell: tel
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
  checkforca() {
    // 查看当前用户是否拥有CA证书
    return axios.post("/demo/checkforca", {});
  },
  applica() {
    // 申请CA证书
    return axios.post("/demo/applica", {});
  },
  sign() {
    // 进行SIM盾签名
    return axios.post("/demo/sign", {});
  },
  approvebyid(id, comment) {
    // 审批功能
    return axios.post("/demo/approvebyid", {
      contractId: id,
      approveComment: comment
    });
  }
};
