import qs from "qs";
import Mock from "mockjs";

// 生成测试数据

if (process.env.NODE_ENV !== "production") {
  let infoTemp = {
    id: /\d{4}/,
    appliId: /\d{9}/,
    applicant: "@CNAME",
    appliName: "@applicant",
    //tel: /1[356789]\d{9}/,
    appliDate: Mock.Random.date("yyyy-MM-dd"),
    department: "移动端API测试 - 移动端API测试",
    job: /(测试)|(工程师)|(设计师)|(产品经理)|(室经理)/,
    appliItem: "@CSENTENCE",
    approverId: /\d{9}/
  };

  Mock.setup({
    timeout: "200-600"
  });

  Mock.mock(/\/demo\/checkwaitingmsg(\?.*)?$/, "get", options => {
    let filter =
      options.body ||
      qs.parse(options.url.match(/\/checkwaitingmsg\??(.*)$/)[1]) ||
      {};
    filter.page = Number(filter.page) || 1;
    filter.size = Number(filter.size) || 100;
    let count = filter.size;
    if (filter.page === 1) {
      count = Math.floor(Math.random() * 20);
    } else if (filter.page > 1) {
      count = 0;
    }
    let data = Mock.mock({
      success: true,
      code: 200,
      page: filter.page,
      size: filter.size,
      count: count,
      [`data|${count}`]: [infoTemp]
    });

    return data;
  });

  Mock.mock("/demo/login", "post", options => {
    return {
      success: true,
      code: 200,
      data: options.data
    };
  });

  Mock.mock("/demo/formsub", "post", options => {
    return {
      success: true,
      code: 200,
      data: options.data
    };
  });

  Mock.mock(/\/demo\/checkbyid(\?.*)?$/, "get", options => {
    let filter =
      options.body ||
      qs.parse(options.url.match(/\/checkbyid\??(.*)$/)[1]) ||
      {};
    let id = filter.id;
    let temp = Object.assign({}, infoTemp);
    temp.id = id;
    let data = Mock.mock({
      success: true,
      code: 200,
      data: temp
    });

    return data;
  });
}
