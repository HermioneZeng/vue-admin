<template>
  <base-layout :fBorder="false" :cBorder="false">
    <div slot="header" style="position: relative">
      <span>角色管理</span>
    </div>
    <template slot="table_content">
      <div class="form_con">
        <el-row>
          <el-col :span="4">
            <p class="tree_header">角色列表</p>
            <div class="leftTree">
              <el-tree ref="roleTree"  :data="roleTree" node-key="roleId" :props="defaultProps" accordion highlight-current @node-click="nodeClick" class="leftTree"></el-tree>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="main-right">
              <div class="title border-bottom">
                <span class="sub-title">  角色配置:</span>
                <el-button icon="el-icon-plus" size="small" type="info" plain  @click="type='add';resetRoleForm()">新增角色</el-button>
                <el-button icon="el-icon-edit" size="small" type="info" plain  @click="updateView">修改角色</el-button>
                <el-button icon="el-icon-delete" size="small" type="info" plain @click="deleteRoleView">删除角色</el-button>
                <el-button icon="el-icon-document" size="small" type="info" plain  @click="menuConfigHandle">菜单权限</el-button>
              </div>
            </div>
            <div class="form_box">
              <el-form  label-width="110px" :model="roleForm" ref="roleForm" size="small">
                <el-form-item label="角色编码：" prop="roleCode" :rules="[ { required: true, message: '角色编码不能为空'},{pattern:/^[A-Za-z0-9_]{3,16}$/,message:'格式不正确(数字/字母/下划线)(3-16位)'}]">
                  <el-input v-model = "roleForm.roleCode"></el-input>
                </el-form-item>
                <el-form-item label="角色名称：" prop="roleName" :rules="[ { required: true, message: '角色名称不能为空'}]">
                  <el-input v-model = "roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="可授出角色：" prop="ruleRoleIds" style="margin-bottom: 20px" class="availableRole">
                  <el-checkbox-group v-model="roleForm.ruleRoleIds">
                    <el-checkbox v-for="item in allowRole" :label="item.roleId" :key="item.roleId" border size="small">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item  v-show="type=='add'">
                  <el-button icon="el-icon-refresh" size="small" type="primary"  @click="resetRoleForm">重置</el-button>
                  <el-button icon="el-icon-plus" size="small" type="primary"  @click="addRole">保存</el-button>
                </el-form-item>
                <el-form-item  v-show="type=='update'">
                  <el-button icon="el-icon-refresh" size="small" type="primary" @click="resetRoleForm">重置</el-button>
                  <el-button icon="el-icon-edit" size="small" type="primary" @click="updateRole">修改</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
        <!--配置菜单弹窗-->
        <el-dialog  :visible.sync="cfgMenuDialog">
          <div class="dialogHeader"><span>配置菜单权限</span></div>
          <div class="treeWarp">
            <el-tree :data="allMenu"   node-key="DATA_ID" ref="allMenu" show-checkbox accordion :props="{label:'DATA_NAME',children:'children'}"></el-tree>
          </div>
          <span slot="footer" class="dialog-footer">
           <el-button @click="cfgMenuDialog=false">关闭</el-button>
           <el-button type="primary" @click="submitCfgMenu">提交</el-button>
          </span>
        </el-dialog>
      </div>
    </template>
  </base-layout>
</template>

<script>
  import '../../assets/css/rightManage.styl'
  export default {
    data() {
      return {
        powerDialog: false,
        cfgMenuDialog: false,
        rightRuleDialog: false,
        type: 'view',
        updateButton: false,
        roleForm: {
          roleCode: '',
          roleName: '',
          ruleRoleIds: []
        },
        rightRuleform: {
          rigthIds: []
        },
        defaultProps: {
          children: '',
          label: 'roleName'
        },
        roleTree: [],
        currentSelectedNode: null,
        allowRole: [],
        allButtonMenu: [], //按钮菜单权限
        allMenu: [], //返回可授权的菜单
        allCheckedMenu: [], //保存角色已选中菜单，用于反选树
        allRightRule: [] //所有的数据权限
      }
    },
    methods: {
      //页面操作
      nodeClick(node) {
        this.type = 'view';
        this.currentSelectedNode = node.roleId;
        this.queryByRoleId(node.roleId);
      },
      resetRoleForm() {
        this.$refs['roleForm'].resetFields();
        this.$refs['roleTree'].setCheckedKeys([]);
      },
      menuConfigHandle() {
        if (this.currentSelectedNode == null) {
          this.$message.warning("请选择角色后再配置菜单权限");
          return false;
        }
        this.cfgMenuDialog = true;
        this.queryRoleAllowMenu(this.currentSelectedNode);
      },
/*      buttonMenuConfigHandle() {
        if (this.currentSelectedNode == null) {
          this.$message.warning("请选择角色后再配置按钮权限");
          return false;
        }
        this.powerDialog = true;
        this.queryAllowButtonMenu(this.currentSelectedNode);
      },*/
 /*     rightRuleHandle() {
        if (this.currentSelectedNode == null) {
          this.$message.warning("请选择角色后再配置数据权限");
          return false;
        }
        this.rightRuleDialog = true;
        this.getSelectRightRuleByRoleId(this.currentSelectedNode);
      },*/
      submitCfgMenu() {
        var params = {
          roleId: null,
          ruleIds: null,
          type: 1
        };
        params.roleId = this.currentSelectedNode;
        params.ruleIds = this.$refs.allMenu.getCheckedKeys(true);
        var url='system/role/sumitRight'
        this.$fetch.doPost(url,params).then((resp) => {
        if (resp.returnCode == 1) {
          this.$message.success(resp.returnMsg);
          this.cfgMenuDialog = false;
        } else {
          this.$message.error(resp.returnMsg);
        }
      }, (error) => {
          this.$message.error("保存按钮菜单权限出错" + error);
        })
      },
      submitPowerDialog() {
        var params = {
          roleId: null,
          ruleIds: null,
          type: 2
        };
        params.roleId = this.currentSelectedNode;
        params.ruleIds = this.$refs.allButtonMenu.getCheckedKeys(true);
        var url='system/role/sumitRight'
        this.$fetch.doPost(url,params).then((resp) => {
        if (resp.returnCode == 1) {
          this.$message.success(resp.returnMsg);
          this.powerDialog = false;
        } else {
          this.$message.error(resp.returnMsg);
        }
      }, (error) => {
          this.$message.error("保存权限菜单出错" + error);
        })
      },
      submitRightRule() {
        var params = {
          roleId: null,
          ruleIds: null,
          type: 3
        };
        params.roleId = this.currentSelectedNode;
        params.ruleIds = this.rightRuleform.rigthIds;
        var url='system/role/sumitRight'
        this.$fetch.doPost(url,params).then((resp) => {
        if (o.returnCode == 1) {
          this.$message.success(resp.returnMsg);
          this.rightRuleDialog = false;
        } else {
          this.$message.error(resp.returnMsg);
        }
      }, (error) => {
          this.$message.error("保存数据出错" + error);
        })
      },
      //数据请求相关
      addRole() { //新增角色
        var isVlid = false;
        this.$refs["roleForm"].validate((valid) => {
          if (valid) {
            isVlid = true;
            var url='system/role/add'
            this.$fetch.doPost(url,this.roleForm).then((resp) => {
              if (resp.returnCode == "1") {
              this.$message({
                message: resp.returnMsg,
                type: 'success'
              });
              this.type = 'view';
              this.resetRoleForm();
              //this.queryRole();
              this.roleRule();
            } else {
              this.$message({
                message: "新增失败： " + resp.returnMsg,
                type: 'error'
              });
            }
          }, (error) => {
              this.$message.error(error);
            })
          } else {
            return false;
          }
        });
      },
      //修改角色
      updateRole() {
        var isVlid = false;
        this.$refs["roleForm"].validate((valid) => {
          if (valid) {
            isVlid = true;
            var url='system/role/update'
            this.$fetch.doPost(url,this.roleForm).then((resp) => {
              if (resp.returnCode == "1") {
              this.$message({
                message: resp.returnMsg,
                type: 'success'
              });
              this.type = 'view';
              this.resetRoleForm();
              //this.queryRole();
              this.roleRule();
            } else {
              this.$message({
                message: "修改角色失败： " + resp.returnMsg,
                type: 'error'
              });
            }
          }, (error) => {
              this.$message.error(error);
            })
          } else {

          return false;
        }
      });
      },
      updateView() {
        if (this.currentSelectedNode == null) {
          this.$message({
            message: "请点击修改的角色 ",
            type: 'warning'
          });
          return;
        }
        this.queryByRoleId(this.currentSelectedNode);
        this.type = 'update';
      },
      /*queryRole() { //查询所有的角色
        var params = {
          roleMap: {}
        };
        this.$fetch.roleQuery(params).then((resp) => {
        this.roleTree = resp.data;
        //this.allowRole = resp.data.list;
      }, (error) => {

        })
      },*/
      roleRule:function(){//当前登录用户可授权角色
        var url='system/role/query/roleRuleSelect'
        this.$fetch.doGet(url).then((rep) => {
          if (rep.returnCode == "1") {
          this.allowRole = rep.data;
          this.roleTree = rep.data;
        }
      }, (error) => {
          this.$message.error(error);
        })
      },
 /*     queryAllowRole(roleId) { //查询可授权的角色
        var params = roleId;
        this.$fetch.queryAllowRole(params).then((resp) => {
        if (resp.returnCode == 1) {
          // this.allowRole = o.data;
        } else {
          this.$message.error(resp.returnMsg);
        }
      }, (error) => {
          this.$message.error(error);
        })
      },*/
      queryAllowMenu() { //查询可选菜单树
        var url='system/resource/query/tree/allMenu'
        this.$fetch.doGet(url).then((resp) => {
          var arr = [];
        if (resp.returnCode == 1) {
          arr.push(resp.data)
          this.allMenu = arr;
        } else {
          this.$message({
            message: "查找菜单树失败： ",
            type: 'error'
          });
        }
      }, (error) => {
          this.$message({
            message: "查找菜单树失败： " + error,
            type: 'error'
          })
        })
      },
     queryAllButtonMenu() { //查询所有的按钮菜单
     /*  this.$fetch.querySystemMenu().then((resp) => {
          arr = [];
        if (resp.returnCode == 1) {
          arr.push(resp.data)
          this.allButtonMenu = arr;
        } else {
          this.$message({
            message: "查找按钮权限失败： " + o.returnMsg,
            type: 'error'
          });
        }
      }, (error) => {
          this.$message({
            message: "查找按钮权限失败： " + error,
            type: 'error'
          })
        })*/
      },
      queryRoleAllowMenu(roleId) { //获取角色对应菜单
        var url='system/resource/query/selectMenu'
        this.$fetch.doGet(url,roleId).then((resp) => {
        if (resp.returnCode == 1) {
          this.$refs.allMenu.setCheckedKeys(resp.data);
        } else {
          this.$message({
            message: "根据角色查找已授权的菜单失败： ",
            type: 'error'
          });
        }
      }, (error) => {
          this.$message({
            message: "根据角色查找已授权的菜单失败： " + error,
            type: 'error'
          })
        })
      },
/*      queryAllowButtonMenu(roleId) { //获取角色对应的菜单
        this.$fetch.queryAllowButtonMenu(roleId).then((resp) => {
        if (resp.returnCode == 1) {
          this.$refs.allButtonMenu.setCheckedKeys(resp.data);
        } else {
          this.$message({
            message: "根据角色查找已授权的菜单失败： ",
            type: 'error'
          });
        }
      }, (error) => {
          this.$message({
            message: "根据角色查找已授权的菜单失败： " + error,
            type: 'error'
          })
        })
      },*/
      //获取角色对应的数据权限
/*      getSelectRightRuleByRoleId(roleId) { //获取角色对应的菜单
        var url='system/role/query'
        this.$fetch.getSelectRightRuleByRoleId(roleId).then((resp) => {
        if (resp.returnCode == 1) {
          this.rightRuleform.rigthIds = resp.data;
        } else {
          this.$message({
            message: "根据角色查找已授权的菜单失败： ",
            type: 'error'
          });
        }
      }, (error) => {
          this.$message({
            message: "根据角色查找已授权的菜单失败： " + error,
            type: 'error'
          })
        })
      },*/
      //查询所有的数据权限规则
      queryAllRightRule() {
   /*     var param = {
          "rightRuleRelationMap": {}
        };
        this.$fetch.queryAllRightRuleGroupByCode(param).then((resp) => {
        if (resp.returnCode == 1) {
          this.allRightRule = resp.data;
        } else {
          this.$message({
            message: "查找数据权限失败",
            type: 'error'
          });
        }
      }, (error) => {
          this.$message({
            message: "查找数据权限失败 " + error,
            type: 'error'
          })
        })*/
      },
      queryByRoleId(rId) { //根据roleId查询对应详情
        var url='system/role/query'
        this.$fetch.doGet(url,rId).then((resp) => {
        if (resp.returnCode == 1) {
          this.roleForm=resp.data
         /* this.roleForm.roleCode = resp.data.role.roleCode;
          this.roleForm.roleName = resp.data.role.roleName;
          this.roleForm.ruleRoleIds.length = 0;
          this.roleForm.ruleRoleIds.push(...resp.data.ruleRoleIds)*/
        } else {
          this.$message.error(resp.returnMsg);
        }
      }, (error) => {
          this.$message.error("获取角色详情出错！");
        })
      },
      deleteRoleView() {
        if (this.currentSelectedNode == null) {
          this.$message.warning("请选择需要删除的角色");
          return;
        }
        this.$confirm('确认删除角色？').then(() => {
          this.deleteRole();
      }).catch(() => {});

      },
      deleteRole() { //删除角色
        var params = {
          roleIds: []
        }

        params.roleIds.push(this.currentSelectedNode);
        var url='system/role/delete'
        this.$fetch.doPost(url,params).then((resp) => {
        if (resp.returnCode == "1") {
          this.$message({
            message: resp.returnMsg,
            type: 'success'
          });
          this.resetRoleForm();
          this.roleRule();
          //this.queryRole();
        } else {
          this.$message({
            message: "删除失败： " + resp.returnMsg,
            type: 'error'
          });
        }
      }, (error) => {
          this.$message({
            message: "删除失败, ",
            type: 'error'
          });
        })
      },

    },
    created() {
      //this.queryRole();
      this.roleRule();
      this.queryAllowMenu();
      this.queryAllButtonMenu();
      this.queryAllRightRule();
    }
  }
</script>
