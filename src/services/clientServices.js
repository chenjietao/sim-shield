import "../test/webContain"; // 测试平台上模拟和飞信能力平台的函数

/**
 * 根据当前平台获取和飞信能力容器(webContainer对象)
 * @returns {Object}
 */
function clientWebContaner() {
  let u = navigator.userAgent;
  if (u.indexOf("iPhone") > -1 || u.indexOf("iPad") > -1) {
    return navigator.webContainer;
  } else {
    return window.webContainer;
  }
}

/**
 * 生成全局函数，用于处理和飞信能力平台的回调
 * @param {String} backId 回调标示id
 * @param {String} backFunc 回调函数名(全局函数)
 * @param {Function} callback 回调
 */
function handleCallback(backId, backFunc, callback) {
  window[backFunc] = function(arg1, arg2) {
    let bId, data;
    if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
      // 无参数
      if (typeof callback === "function") {
        callback(); // 直接调用
      }
      window[backFunc] = null;
      delete window[backFunc]; // 销毁全局函数
      return;
    } else if (typeof arg2 === "undefined") {
      // 只有一个参数
      data = arg1;
    } else {
      // 两个参数都不为空
      bId = arg1;
      data = arg2;
    }
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.log(e);
    }

    if (bId) {
      if (bId === backId) {
        if (typeof callback === "function") {
          callback(data);
        }
        window[backFunc] = null;
        delete window[backFunc];
      }
    } else {
      if (typeof callback === "function") {
        callback(data);
      }
      window[backFunc] = null;
      delete window[backFunc];
    }
  };
}

function getEnterpriseContact(callback) {
  // 获取当前用户在当前企业的信息
  let rand = Math.floor(Math.random() * 10000000),
    backId = `backId_${rand}`, // 回调标示id
    backFunc = `backFunc_${rand}`; // 全局回调函数名
  handleCallback(backId, backFunc, callback); // 生成全局回调函数
  let wc = clientWebContaner();
  wc.getEnterpriseContact(backId, backFunc); // 调用
}

function getEnterpriseContactById(contactId, callback) {
  // 通过联系人id获取用户企业的信息
  let rand = Math.floor(Math.random() * 10000000),
    backId = `backId_${rand}`,
    backFunc = `backFunc_${rand}`;
  handleCallback(backId, backFunc, callback);
  let wc = clientWebContaner();
  wc.getEnterpriseContactById(contactId, backId, backFunc);
}

function getEnterpriseContactByPhone(phone, callback) {
  // 通过电话号码获取用户企业的信息
  let rand = Math.floor(Math.random() * 10000000),
    backId = `backId_${rand}`,
    backFunc = `backFunc_${rand}`;
  handleCallback(backId, backFunc, callback);
  let wc = clientWebContaner();
  wc.getEnterpriseContactByPhone(phone, backId, backFunc);
}

function selectEnterpriseContactWithEnterId(eid, callback) {
  // 根据企业id选择企业联系人（单选）
  let rand = Math.floor(Math.random() * 10000000),
    backId = `backId_${rand}`,
    backFunc = `backFunc_${rand}`;
  handleCallback(backId, backFunc, callback);
  let wc = clientWebContaner();
  wc.selectEnterpriseContactWithEnterId(
    JSON.stringify({
      title: "",
      enterpriseId: eid,
      backId: backId,
      backFunc: backFunc
    })
  );
}

export default {
  clientWebContaner,
  getEnterpriseContact,
  getEnterpriseContactById,
  getEnterpriseContactByPhone,
  selectEnterpriseContactWithEnterId
};
