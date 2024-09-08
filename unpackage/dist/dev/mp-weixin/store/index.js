"use strict";
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  state: {
    // 状态数据定义
    openid: 0
  },
  mutations: {
    setOpenid(state, id) {
      state.openid = id;
    }
  }
});
exports.store = store;
