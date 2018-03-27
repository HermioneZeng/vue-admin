export default{
  install:function(Vue){
    Vue.directive('collapse', {
      bind(el, binding, vnode) {
        el.onclick = function() {
          vnode.context.collapseVisible = !vnode.context.collapseVisible;
        }
      },
      inserted(el, binding, vnode) {},
      update(el, binding, vnode) {
        el.innerHTML = vnode.context.collapseVisible?'收起':"展开";
        //el.querySelector('span').className = vnode.context.collapseVisible?'el-icon-arrow-up':'el-icon-arrow-down';
        el.className = vnode.context.collapseVisible?'el-icon-arrow-up':'el-icon-arrow-down';
      },
      componentUpdated(el, binding, vnode) {},
      unbind(el, binding, vnode) {}
    })
  }
}
