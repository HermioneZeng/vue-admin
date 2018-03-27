/**
 * 系统管理
 */
import fetch from '../../fetch/index.js'
const state ={
  areaTree:[],
  departTree:[]
}

const actions = {
  async getAreaTree({commit, state}) {
    var url='system/area/getAreaTree'
    fetch.doGet(url).then((resp) => {
      if (resp.returnCode == "1") {
        commit('setAreaTree', resp.data.list);
      }
    }, (error) => {

    })
  },
  async getDeptTree({commit, state}) {
    var url='system/getDepartTree'
    fetch.doGet(url).then((resp) => {
      if (resp.returnCode == "1") {
        commit('setDeptTree', resp.data.list);
      }
    }, (error) => {

    })
  }
}
let mutations = {
    setAreaTree(state, areaTree){
      state.areaTree = areaTree;
    },
    setDeptTree(state, deptTree){
      state.deptTree = deptTree;
    }
}

let getters = {
    areaTree:(state, e)=>{
      return state.areaTree;
    },
    departTree:(state, e)=>{
      return state.departTree;
    }
}

export default {
  state,
  getters,
  actions,
  mutations
}
