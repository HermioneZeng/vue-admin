/*
* @jing
* @old 需要翻译字段值
* @refSource 翻译值参照的数组对象
* @key 参照数组项中键 default value 'key'
* @value 参照数组项中值 default value 'value'
* */
function translate(old,refSource,key = 'key',value = "value"){
  for(var item of refSource){
    if(item[key] == old)
      return item[value]
  }
  return old
}

function formatIndentify(val){
  if(val) {
    var arr = val.split("");
    arr.splice(10, 4, '****');
    return arr.join("");
  }else
    return val
}

export default {
  install:function(Vue){
    Vue.filter('translate',translate);
    Vue.filter('formatIndentify',formatIndentify);
  }
}
