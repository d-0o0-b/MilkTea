import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 记录登录账号索引值 
    index: null,

    // 记录当前手机号
    phone: '',

    // 是否已登录
    isLogin: false,

    // 当前商品id 默认值为1
    pid: 1,
  },
  mutations: {
    // 找出当前账号索引值
    setUserData(state) {
      let data = JSON.parse(localStorage.getItem('userInfo'))
      data.map(
        (item,index) => {
          if(item.phone == state.phone) {
            state.index = index
            return
          }
        }
      )
    },

    // 登录
    login(state,phone) {
      state.isLogin = true
      state.phone = phone
    },

    // 更改当前商品id
    changePid(state,id) {
      this.state.pid = id
    }
  },
  actions: {
  },
  modules: {
  }
})
