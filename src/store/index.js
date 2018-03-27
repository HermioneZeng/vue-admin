import Vue from 'vue'
import Vuex  from 'vuex'
import system from './modules/system'
import host from '../fetch/host'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex);
const state = {
  basicUrl: host.hostIp,
  authorization: '',
  ruleCodes:[],
  menus:[],
  userName:'',
  userId:'',
  departName:''
}
const mutations = {
  setAuthorization(state, res) {
    state.authorization = res;
  },
  setMenus(state, res) {
    state.menus = res;
  },
  setRuleCodes(state, res) {
    state.ruleCodes = res;
  },
  setUserName(state, res){
    state.userName = res;
  },
  setUserId(state, res){
    console.log(res);
    state.userId = res;
  },
  setDepartName(state, res){
    state.departName = res;
  }
}
const getters =  {
  basicUrl(state){
    return state.basicUrl
  } ,
  authorization(state){
    return state.authorization;
  },
  menus(state){
    return state.menus;
  },
  ruleCodes(state){
    return state.ruleCodes;
  },
  userName(state){
    return state.userName
  },
  userId(state){
    return state.userId
  },
  departName(state){
    return state.departName
  }
}
/*持久化*/
const vuexLocal = new VuexPersistence({
  key : 'persist',
  storage : window.sessionStorage
});

export default new Vuex.Store({
    state,
    getters,
    mutations,
    modules:{
      system
    },
    plugins:[vuexLocal.plugin]
})
