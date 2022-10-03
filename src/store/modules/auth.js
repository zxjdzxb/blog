import auth from '@/api/auth'

const state = {
  user: null,
  isLogin: false
}

const getters = {
  // 获取 state 数据
  user: state => state.user,
  isLogin: state => state.isLogin
}

const mutations = {
  // 更新用户数据
  setUser(state, payload) {
    state.user = payload.user
  },
  // 更新登录状态
  setLogin(state, payload) {
    state.isLogin = payload.isLogin
  }
}

const actions = {
  login({commit}, {username, password}) {
    return auth.login({username, password})
      .then(res => {
        commit('setUser', {user: res.data})
        commit('setLogin', {isLogin: true})
      })
  },
  async register({commit}, {username, password}) {
    let res = await auth.register({username, password})
    commit('setUser', {user: res.data})
    commit('setLogin', {isLogin: true})
    return res.data
  },

  async logout({commit}) {
    await auth.logout()
    commit('setUser', {user: null})
    commit('setLogin', {isLogin: false})
  },

  async checkLogin({commit, state}) {
    // 先从本地store的state去看用户是否登录,如果登录了 就返回true
    if (state.isLogin) return true
    let res = await auth.getInfo()
    commit('setLogin', {isLogin: res.isLogin})
    // 如果本地没有这个状态，就发ajax请求去服务器，服务器会返回一个isLogin的响应，根据这个值来确定是否登录
    if (!res.isLogin) return false
    commit('setUser', {user: res.data})
    return true
  }

  /*
    this.logout().then(isLogin=>{

    })

  */
}

export default {
  state,
  getters,
  mutations,
  actions
}
