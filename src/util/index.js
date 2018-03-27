/**
 * Created by Administrator on 2017/11/14.
 */
export default {
  hasNode(o, chiledName) {
    return o[chiledName] && o[chiledName].length > 0;
  },
  getCascaderSelectIds(tree, id, idname, chiledName) {
    var result = [];
    if (tree) {
        tree.forEach((item) => {
          if (item[idname] == id) {
          result.push(id);
          return result;
        } else {
          var flag = this.hasNode(item, chiledName);
          if (flag) {
            var tmp = this.getCascaderSelectIds(item[chiledName], id, idname, chiledName);
            if (tmp.length > 0) {
              result.push(item[idname])
              tmp.forEach(function(sItem) {
                result.push(sItem)
              })
              return result;
            } else {
              return [];
            }
          } else {
            return [];
          }
        }
      })
    }
    return result;
  }
}
