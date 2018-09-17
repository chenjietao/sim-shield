import Mock from "mockjs";

if (process.env.NODE_ENV !== "production") {
  // 构造测试数据
  window.navigator.webContainer = window.webContainer = {
    getEnterpriseContact: function(backId, backFunc) {
      let data = [
        Mock.mock({
          address: "@PROVINCE @CITY @COUNTRY",
          phone: "15521115742",
          email: "@EMAIL",
          company: "@CTITLE",
          headColor: "",
          birthday: "@DATE('yyyy-MM-dd')",
          enterpriseId: /\d{9}/,
          position: "@CTITLE",
          headImg: "",
          contryCode: "+86",
          id: /\d{9}/,
          name: "@CNAME",
          eUserId: "/[0-9A-F]{32}/",
          department: "@company - @CTITLE"
        })
      ];
      if (typeof window[backFunc] === "function") {
        window[backFunc].call(window, backId, JSON.stringify(data));
      }
    },
    getEnterpriseContactById: function(contactId, backId, backFunc) {
      let data = [
        Mock.mock({
          address: "@PROVINCE @CITY @COUNTRY",
          phone: /1[356789]\d{9}/,
          email: "@EMAIL",
          company: "@CTITLE",
          headColor: "",
          birthday: "@DATE('yyyy-MM-dd')",
          enterpriseId: /\d{9}/,
          position: "@CTITLE",
          headImg: "",
          contryCode: "+86",
          id: contactId,
          name: "@CNAME",
          eUserId: "/[0-9A-F]{32}/",
          department: "@company - @CTITLE"
        })
      ];
      if (typeof window[backFunc] === "function") {
        window[backFunc].call(window, backId, JSON.stringify(data));
      }
    },
    getEnterpriseContactByPhone: function(phone, backId, backFunc) {
      let data = [
        Mock.mock({
          address: "@PROVINCE @CITY @COUNTRY",
          phone: phone,
          email: "@EMAIL",
          company: "@CTITLE",
          headColor: "",
          birthday: "@DATE('yyyy-MM-dd')",
          enterpriseId: /\d{9}/,
          position: "@CTITLE",
          headImg: "",
          contryCode: "+86",
          id: /\d{9}/,
          name: "@CNAME",
          eUserId: "/[0-9A-F]{32}/",
          department: "@company - @CTITLE"
        })
      ];
      if (typeof window[backFunc] === "function") {
        window[backFunc].call(window, backId, JSON.stringify(data));
      }
    },
    selectEnterpriseContactWithEnterId: function(jsonString) {
      window.$eventBus.$toast.message("假装弹出选人框选人");
      let json = JSON.parse(jsonString);
      let backFunc = json.backFunc;
      let backId = json.backId;
      let data = [
        Mock.mock({
          address: "@PROVINCE @CITY @COUNTRY",
          phone: /1[356789]\d{9}/,
          email: "@EMAIL",
          company: "@CTITLE",
          headColor: "",
          birthday: "@DATE('yyyy-MM-dd')",
          enterpriseId: json.enterpriseId,
          position: "@CTITLE",
          headImg: "",
          contryCode: "+86",
          id: /\d{9}/,
          name: "@CNAME",
          eUserId: "/[0-9A-F]{32}/",
          department: "@company - @CTITLE"
        })
      ];
      if (typeof window[backFunc] === "function") {
        setTimeout(() => {
          window[backFunc].call(window, backId, JSON.stringify(data));
        }, 2000);
      }
    }
  };
}
