var BASE = {
  /**
   * @description api请求基础路径
   */
  API_DEV: {
    common: "http://172.16.9.180:8890",
    buyer: "http://172.16.9.180:8888",
    seller: "http://172.16.9.180:8889",
    manager: "http://172.16.9.180:8887"
  },
  API_PROD: {
    common: "https://common-api.pickmall.cn",
    buyer: "https://buyer-api.pickmall.cn",
    seller: "https://store-api.pickmall.cn",
    manager: "https://admin-api.pickmall.cn"
  },
  /**
   * @description // 跳转买家端地址 pc端
   */
  PC_URL: "https://pc-b2b2c.pickmall.cn",
  /**
   * @description  // 跳转买家端地址 wap端
   */
  WAP_URL: "https://m-b2b2c.pickmall.cn",
  /**
   *  @description api请求基础路径前缀
   */
  PREFIX: "/store"
};
