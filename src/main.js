// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'
import './assets/css/overlay.styl'
Vue.use(ElementUI);
Vue.config.productionTip = false;

//Font Awesome
import 'vue-awesome/icons/flag'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
Vue.component('icon', Icon);

//contextMenu
import ELContextMenu from './components/contextMenu/index.js'
Vue.use(ELContextMenu);
//register layout
import Layout from './components/layout/base'
Vue.component('BaseLayout',Layout);

//fetch
import fetch from './fetch/index.js'
Vue.prototype.$fetch =  Vue.$fetch = fetch;

//filters
import filters from './filter/index.js'
Vue.use(filters);

//utils
import utils from './util/index.js'
Vue.prototype.$util = utils;

// //Login Interceptor
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.authorization) {  // 通过vuex state获取当前的token是否存在
        next();
    }
    else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
