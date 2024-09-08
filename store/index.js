import {
	createStore
} from "vuex";

export default createStore ({
  state: {
    // 状态数据定义
    openid: 0
  },
  mutations: {
	  setOpenid(state, id) {
		  state.openid = id
	  }
  },
})