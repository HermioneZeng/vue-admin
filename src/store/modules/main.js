/**
 * 主页面
 */
const state ={
  ruleCodes:[],
  menus:[]
}

const actions = {}
const mutations = {
  setMenus(state, res) {
    state.menus = res;
  },
  setRuleCodes(state, res) {
    state.ruleCodes = res;
  }
}

const getters = {
  menus:(state, e)=> state.menus,
  ruleCodes:state => state.ruleCodes
}

export default {
  state,
  getters,
  actions,
  mutations
}
