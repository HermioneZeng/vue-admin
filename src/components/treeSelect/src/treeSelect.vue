    <template>
        <div class="el-treeSelect" :style="{width:width}"  v-clickoutside="closeDropdown">
            <div :class="wrapCls" @click.stop="openDropdown" ref="input-area">
                <scrollbar ref="scrollbar" tag="ul"
                    wrap-class="el-select-dropdown__wrap"
                    view-class="el-select-dropdown__list">
                    <ul class="drop-list">
                        <li v-for="item in value"><span>{{item[keyName]}}</span></li>
                    </ul>
                </scrollbar>
                <span v-show="!value.length" style="padding-left:8px;position: absolute; top: 0;color:#a5b4c7;">请选择</span>
                <span v-if="value.length && !disable" class="clear-selected" @click.stop="clearSelected">
                    <el-icon name="circle-cross"></el-icon>
                </span>
            </div>
            <div class="dropdownCls">
                <scrollbar v-show="open" tag="ul"
                    wrap-class="el-select-dropdown__wrap"
                    view-class="el-select-dropdown__list">
                    <slot></slot>
                </scrollbar>
            </div>
        </div>
    </template>
    <style scoped>

    /*element Tree 样式*/
    .el-treeSelect {
        position: relative;
        display:inline-block;
        width:100%;
    }

    .treeSelect {
        outline: none;
        user-select: none;
        box-sizing: border-box;
        display:inline-block;
        background-color: #fff;
        border: 1px solid #d9d9d9;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        position: relative;
        white-space: nowrap;
        height: 30px;
        line-height:30px;
        width:100%;
        vertical-align: middle;
    }

    .treeSelect-open {
        border-color: #5eafed;
        box-shadow: 0 0 1px #5eafed;
    }

    .badge {
        display: inline-block;
        min-width: 10px;
        padding: 1px 10px;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: left;
        white-space: nowrap;
        vertical-align: middle;
        border-radius: 10px;
        cursor: pointer;
        height: 200px;
    }


    .dropdownCls {
        background-color: #fff;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        position: absolute;
        top: 42px;
        outline: none;
        overflow: hidden;
        font-size: 12px;
        text-align: left;
        max-height: 274px;
        width: 100%;
        z-index: 999999;
        min-width:450px;
    }

    .drop-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .drop-list::after {
        content: ".";
        display: block;
        height: 0;
        font-size: 0;
        clear: both;
    }

    .drop-list li {
        /*background-color: #5eafed;*/
        border-radius: 4px;
        cursor: default;
        display: inline-block;
        padding: 0 2px;
        margin-right: 4px;
        max-width: 99%;
        position: relative;
        overflow: hidden;
        line-height: 1.5;
        transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        color: #fff;
    }

    .drop-list li span {
        line-height: 1;
        font-size: 13px;
        background: #5eafed;
        padding: 4px;
        border-radius: 4px;
    }

    .clear-selected {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        width: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .clear-selected:hover {
        color: #20a0ff;
    }

    .select-tree-disable {
        background: #fff;
    }
    </style>

    <script>
        import {Scrollbar,Icon} from 'element-ui';
        export default {
            name: 'ElTreeSelect',
            data: function() {
                return {
                    prefix: "treeSelect",
                    open: false,
                }
            },
            props: {
                width: {
                    type: String,
                    default: ""
                },
                value: {
                    type:Array,
                    default:function(){
                        return []
                    }
                },
                keyName: {
                    type: String,
                    defaut: "label"
                },
                disable:{
                    type:Boolean,
                    default:false
                }
            },
            methods: {
                openDropdown() {
                    if(!this.disable)
                        this.open = !this.open;
                },
                closeDropdown() {
                    this.open = false;
                },
                clearSelected() { //清空选中的节点
                    this.$emit("clear");
                },
            },
            ready() {},
            components: {
                Scrollbar,
                Icon
            },
            directives: { },
            computed: {
                wrapCls() {
                    return [
                        this.prefix,
                        'treeSelect-enabled', {
                            ['treeSelect-open']: this.open,
                            ['select-tree-disable']: this.disable
                        }
                    ]
                }
            },
            watch: {},
            mounted() {}
        }
    </script>
