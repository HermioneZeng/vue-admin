<template>
    <div class="context-menu">
        <ul class="menu">
            <li class="menu-item" v-for="item in before" @click="dropdownClick(item.command)"  :class="[ iconClass(item.command) ]" :style="{color:fontColor(item.command)}">{{item.text}}</li>
            <template v-if="after.length">
                <li class="submenu">
                    <transition  name="fade">
                        <el-dropdown :hide-on-click="false" trigger="hover" @command="dropdownClick">
                            <span class="el-dropdown-link">
                                <el-icon class="el-icon-more"></el-icon>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item  v-for="(item, index) in after"  :key="index" :command="item.command">
                                    <div class="item-text" :class="[ iconClass(item.command) ]" :style="{color:fontColor(item.command)}">{{item.text}}</div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </transition>
                </li>
            </template>
        </ul>
    </div>
</template>

<style lang="stylus" scoped>
    .menu
        list-style:none;
        font-size:14px;
        li
            float:left;
            padding:6px 4px;
            cursor:pointer;
            color:#88BDF1;
            font-size:12px;
            a
                display:block;
                text-decoration: none;
        .submenu
            cursor:pointer;
            position:relative;
    .item-text
        color:#88BDF1;
        padding:0 10px;
        margin:0 -10px;
        font-size:12px;
    .fade-enter-active,
    .fade-leave-active
        transition: opacity .5s
    .fade-enter,
    .fade-leave-active
        opacity: 0
</style>
<script>
  const TYPE_ICON = {
    'send':'el-icon-upload2',//发送
    'config':'el-icon-setting',//配置
    'audit': 'el-icon-document',//审核
    'reset':'el-icon-refresh',//密码重置
    'look':'el-icon-search',//查看
    'edit': 'el-icon-edit',//修改
    'del': 'el-icon-delete',//删除
    'exp': 'el-icon-upload2'//导出
  };
  const TYPE_COLOR = {
    'send':'#EB9E05',
    'config':'#878D99',
    'audit': '#EB9E05',
    'reset':'#EB9E05',
    'look':'#409EFF',
    'edit': '#67C23A',
    'del': '#FA5555',
    'exp': '#409EFF'
  };
   export default {
        name:'ElContextMenu',
        componentName: 'ElContextMenu',
        data() {
            return {
                show:false,
                privateMenus:[],
                types:''
            }
        },
        props:{
            menus:{
                default() {
                    return [];
                }
            },
            default:{
                default:3
            },
            scope:{
                default:{}
            },
            visibles:{
                default() {
                    return [];
                }
            },
            type: {
              type: String,
              default: 'look'
            },
        },
        computed:{
          before(){
            return this.privateMenus.filter(function(item){
                return !item.hasOwnProperty("visible")  || item.visible
            }).slice(0,this.default);
          },
          after(){
            return this.privateMenus.filter(function(item){
                return !item.hasOwnProperty("visible")  || item.visible
            }).slice(this.default)
          },
          color(){
            return TYPE_COLOR[this.type] || '#409EFF';
          },
          ruleCodes(){
            this.$store.getters.ruleCodes;
          }
        },
        watch:{
          menus:function(){
            if(!this.menus || !this.menus.length)
                throw new Error("菜单数据为空")
          },
          visibles:function(){
            this.some()
          }
        },
        components:{

        },
        created(){
           this.some()
        },
        methods:{
            toggle(){
                this.show = !this.show;
            },
            dropdownClick:function(command){
               this.$emit("oper", command , this.scope);
            },
            iconClass:function(command){
                return TYPE_ICON[command]
            },
            fontColor:function(command){
              return TYPE_COLOR[command]
            },
            some:function(){
              /**
              *1 根据是否可见来进行筛选
              *2 根据权限Code来进行更严格筛选
              */
              let rules = this.ruleCodes || [],
                  cloneArr = JSON.parse(JSON.stringify(this.menus)),
                  filterAfterArr = [],
                  visibleArr = [];

              if(this.visibles.length){
                visibleArr = cloneArr.filter(function(item){
                    return item.hasOwnProperty("visible");
                })
                visibleArr.map((item,index)=>{
                    item.visible = Boolean(this.visibles[index])
                    return item;
                })
              }
              filterAfterArr= cloneArr.filter(function(item){
                if(item.hasOwnProperty('ruleCode'))
                    return rules.indexOf(item.ruleCode) > -1
                else
                    return true
              });
              this.privateMenus = [];
              this.privateMenus.push(...filterAfterArr);
            }
        },
    }
</script>
