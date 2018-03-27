import Vue from 'vue'
import Router from 'vue-router'
import login from '@/page/login/login'
Vue.use(Router)

export default new Router({
  linkActiveClass: "on",
  mode: 'history',
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/main',
      name: 'main',
      component: function(resolve){
        require(["../page/main.vue"],resolve)
      },
      meta: {
        requireAuth: false,  // 表示进入页面需要登录
      },
      children:[
          {
            path: 'cargoManage',
            name: 'cargoManage',
            component:  function(resolve) {
              require(['../page/basicData/cargoManage.vue'], resolve);
            }
          },
          {
          path: 'instockOrder',
          name: 'instockOrder',
          component:  function(resolve) {
            require(['../page/instock/instockOrder.vue'], resolve);
          },
          children:[
            {
              path: 'addInStockOrder',
              name: 'addInStockOrder',
              component:  function(resolve) {
                require(['../page/instock/addInStockOrder.vue'], resolve);
              }
            },
            {
              path: 'instockOrderDetail',
              name: 'instockOrderDetail',
              component:  function(resolve) {
                require(['../page/instock/instockOrderDetail.vue'], resolve);
              }
            }
          ]
        },
        {
          path: 'instockStatusQuery',
          name: 'instockStatusQuery',
          component:  function(resolve) {
            require(['../page/instock/instockStatusQuery.vue'], resolve);
          }
        },
        {
          path: 'userManage',
          name: 'userManage',
          component:  function(resolve) {
            require(['../page/system/userManage.vue'], resolve);
          }
        },
        {
          path: 'roleManage',
          name: 'roleManage',
          component:  function(resolve) {
            require(['../page/system/roleManage.vue'], resolve);
          }
        },
        {
          path: 'deptManage',
          name: 'deptManage',
          component:  function(resolve) {
            require(['../page/system/deptManage.vue'], resolve);
          }
        },
        {
          path: 'areaManage',
          name: 'areaManage',
          component:  function(resolve) {
            require(['../page/system/areaManage.vue'], resolve);
          }
        },
        {
          path: 'resourceManage',
          name: 'resourceManage',
          component:  function(resolve) {
            require(['../page/system/resourceManage.vue'], resolve);
          }
        },
        {
          path: 'ipConfig',
          name: 'ipConfig',
          component:  function(resolve) {
            require(['../page/system/ipConfig.vue'], resolve);
          },
          redirect :"ipConfig/userIpCfg",
          children:[
            {
              path: 'userIpCfg',
              name: 'userIpCfg',
              component:  function(resolve) {
                require(['../page/system/ipCfgList/userIpCfg.vue'], resolve);
              }
            },
            {
              path: 'depIpCfg',
              name: 'depIpCfg',
              component:  function(resolve) {
                require(['../page/system/ipCfgList/depIpCfg.vue'], resolve);
              }
            }
          ]
        },
      ]
    }
  ]
})
