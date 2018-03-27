<template>
  <div id="accordion">
    <ul class="side_menu">
      <li v-for="(item, index) in menus" class="item">
        <router-link :to="doRouterLink(item)">
          <div @click="toggle($event,item)" :class="{active:item.show=='true'}">
            <span :class="`bg_${index+1}`"></span>{{item.text}}
          </div>
        </router-link>
        <el-collapse-transition>
          <ul v-if="item.children && item.children.length" v-show="item.show=='true'">
            <li v-for="childitem in item.children" v-show="childitem.resourceExtendAttr!='0'">
              <router-link :to="childitem.route">{{childitem.text}}</router-link>
            </li>
          </ul>
        </el-collapse-transition>
      </li>
    </ul>
  </div>
</template>
<style lang="stylus" scoped>
  @import "../../assets/css/variables.styl"
  #accordion
    position: absolute;
    width: 190px;
    top: 0;
    bottom: 10px;
    left: 0;
    right: 0;
    overflow: auto;
    transition: all 0.3s;
    ul
      list-style: none;
      font-size: 16px;
      li div
        background-color: nav-bg-color;
        color: #e7e6e6;
        height: 48px;
        line-height: 48px;
        cursor: pointer;
        padding-left: 18px;
        transition: all 0.3s cubic-bezier(0.6, -0.28, 0.74, 0.05);
        position: relative;
        span
          display: inline-block;
          width: 22px;
          height: 22px;
          margin-right: 10px;
          vertical-align: middle;
          transition: all 0.3s cubic-bezier(0.6, -0.28, 0.74, 0.05);
        a
          color: #e7e6e6;
          &.on
            color: #efefef
      li div.active
        background-color: nav-bg-color;
        &:before
          content: "";
          height: 32px;
          width: 5px;
          display: inline-block;
          background: #a60704;
          vertical-align: middle;
          position: absolute;
          left: 0;
          top: 8px;
      li ul
        background-color: nav-item-bg-color;
        li
          font-size: 14px;
          a
            padding: 14px 6px 14px 45px;
            display: block;
            color: #9ea1a1;
            text-decoration: none;
            transition: all 0.3s ease;
            &:hover,
            &.on
              color: #333;
              background-color: #fff

  .bg_1
    background: url('./h1.png') no-repeat;

  .active .bg_1,
  .item:hover .bg_1
    background: url('./h1.png') no-repeat;

  .bg_2
    background: url('./h2.png') no-repeat;

  .active .bg_2,
  .item:hover .bg_2
    background: url('./h2.png') no-repeat;

  .bg_3
    background: url('./h3.png') no-repeat;

  .active .bg_3,
  .item:hover .bg_3
    background: url('./h3.png') no-repeat;

  .bg_4
    background: url('./h4.png') no-repeat;

  .active .bg_4,
  .item:hover .bg_4
    background: url('./h4.png') no-repeat;

  .bg_5
    background: url('./h5.png') no-repeat;

  .active .bg_5,
  .item:hover .bg_5
    background: url('./h5.png') no-repeat;

  .bg_6
    background: url('./h6.png') no-repeat;

  .active .bg_6,
  .item:hover .bg_6
    background: url('./h6.png') no-repeat;

  .bg_7
    background: url('./h7.png') no-repeat;

  .active .bg_7,
  .item:hover .bg_7
    background: url('./h7.png') no-repeat;

  .bg_8
    background: url('./h8.png') no-repeat;

  .active .bg_8,
  .item:hover .bg_8
    background: url('./h8.png') no-repeat;

  .fade-enter-active,
  .fade-leave-active
    transition: transform .3s cubic-bezier(0, 0, 0.2, 1);

  .fade-enter,
  .fade-leave-active
    transform: scale(1, 0);
    -transform-origin: top;
    -webkit-transform-origin: top;
    -moz-transform-origin: top;
    -o-transform-origin: top;
    -ms-transform-origin: top;
    -webkit-transform: scale(1, 0);
    -moz-transform: scale(1, 0);
    -o-transform: scale(1, 0);
    -ms-transform: scale(1, 0);

</style>
<script>
  export default {
    data() {
      return {
        menus: [
          {
            "text": "基础数据",
            "route": "/main/cargoManage",
            "children": [
              {
                "text": "商品资料",
                "route": "/main/cargoManage",
                "show": "false",
              }
            ],
            "show": "true"
          },
          {
            "text": "入库管理",
            "route": "/main/instockOrder",
            "children": [
              {
                "text": "入库订单",
                "route": "/main/instockOrder",
                "show": "false",
              },
              {
                "text": "入库状态查询",
                "route": "/main/instockStatusQuery",
                "show": "false",
              }
            ],
            "show": "true"
          },
          {
            "text": "系统管理",
            "route": "/main/userManage",
            "children": [
              {
                "text": "用户管理",
                "route": "/main/userManage",
                "show": "false",
              },
              {
                "text": "角色管理",
                "route": "/main/roleManage",
                "show": "false",
              },
              {
                "text": "部门管理",
                "route": "/main/deptManage",
                "show": "false",
              },
              {
                "text": "地区管理",
                "route": "/main/areaManage",
                "show": "false",
              },
              {
                "text": "资源管理",
                "route": "/main/resourceManage",
                "show": "false",
              },
              {
                "text": "IP管理",
                "route": "/main/ipConfig",
                "show": "false",
              }
            ],
            "show": "false",
          }
        ],
        beforeSrc: "imgs/h1.png",
        hash: ""
      }
    },
    methods: {
      toggle(e, item) {
        item.show = 'true';
        let nIndex = this.menus && this.menus.indexOf(item)
        if (nIndex == 0) {
          this.menus.slice(nIndex + 1).forEach(function (item) {
            item.show = 'false';
          })
        }
        else if (nIndex + 1 == this.menus.length) {
          this.menus.slice(0, nIndex).forEach(function (item) {
            item.show = 'false';
          })
        }
        else {
          this.menus.slice(0, nIndex).forEach(function (item) {
            item.show = 'false';
          })
          this.menus.slice(nIndex + 1).forEach(function (item) {
            item.show = 'false';
          })
        }
      },
      concat: function (index) {
        return `${this.beforeSrc}${index + 1}.png`
      },
      checkMenu: function (parent, data) {
        var path = this.$route.path;
        if (!data || !data.length) return;
        for (var e of data) {
          if (e.route && path.includes(e.route)) {
            if (parent) parent.show = 'true';
            else e.show = 'true';
          } else {
            e.show = 'false'
          }
          if (e.hasOwnProperty('children')) {
            ((e) => {
              this.checkMenu(e, e.children);
            })(e)
          }
        }
      },
      doRouterLink: function (item) {
        var children = item.children;
        if (children && children.length) {
          return children[0].route;
        } else {
          return ""
        }
      }
    },
    watch: {
      '$route': function () {
        this.checkMenu(null, this.menus);
      }
    },
    created: function () {
      this.hash = location.hash;
      // var temp = this.$store.state.menus;
      // this.menus = temp.children ? temp.children : [];
      this.checkMenu(null, this.menus);
    }
  }
</script>
