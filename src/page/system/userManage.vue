<template>
<div>
    <base-layout>
        <div slot="header" >
          <span>用户管理</span>
        </div>
        <div slot="form_content">
        <el-form ref="form" label-width="90px" size="small" :model="form.userMap">
            <div  class="searchHeader">
              <span>查询条件</span>
              <div class="btns">
                  <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
                  <el-button icon="el-icon-refresh" size="small" @click="resetForm('form');query();">重置</el-button>
              </div>
            </div>
            <div class="searchBox">
                <el-row class="searchBar">
                    <el-col :span="6">
                        <el-form-item label="登录名:" prop='loginId'>
                            <el-input v-model="form.userMap.loginId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="姓名:" prop='userName'>
                            <el-input v-model = "form.userMap.userName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="部门:" prop='departId'>
                          <el-cascader :options="departTree" :props="static.defaultprops"  v-model="form.userMap.departId" :show-all-levels="false" :change-on-select="true">
                          </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
        </div>

        <div slot="table_content">
        <div class="table">
            <div class="table-header">
               <span class="title">查询结果</span>
               <div class="btn-group">
                  <el-button size="small" plain class="iconButton" @click="lockUserView('1','解锁')"><icon name="unlock"></icon>解锁</el-button>
                  <el-button size="small" plain class="iconButton" @click="lockUserView('0','锁定')"><icon name="lock"></icon>锁定</el-button>
                  <el-button icon="el-icon-refresh" size="small" plain @click="passwordReset">密码重置</el-button>
                  <el-button icon="el-icon-plus" size="small" plain @click="addNew">新增</el-button>
                  <el-button icon="el-icon-delete" size="small"  plain @click="batchDelete">删除</el-button>
               </div>
            </div>

            <el-table tooltip-effect="light" stripe class="el-table-custom" :data="tableData" @select-all="doSelectAllHandle" @select="doSelectHandle" size="small">
              <el-table-column type="selection" width="60"></el-table-column>
              <el-table-column prop="loginId" label="登录名" ></el-table-column>
              <el-table-column prop="userName" label="姓名" ></el-table-column>
              <el-table-column prop="mobile" label="手机号码" ></el-table-column>
              <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
              <el-table-column prop="userState" label="是否锁定">
                <template slot-scope="scope">
                  {{scope.row.userState | translate(statusList)}}
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-context-menu :menus="menus" :scope="scope"  @oper="clickRow"></el-context-menu>
                </template>
              </el-table-column>
            </el-table>
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="paginationParams.currentPage"
                :page-size="pagination.size"
                layout="total,prev, pager, next, jumper"
                :total="pagination.total">
                </el-pagination>
        </div>
        </div>
    </base-layout>
  <!--新增，修改，查看-->
  <el-dialog :visible.sync="dialogVisible" @close="resetForm('dialogForm')">
    <div class="dialogHeader">
      <span v-show="oper==='add'">新增</span>
      <span v-show="oper==='modify'">修改</span>
      <span v-show="oper==='detail'">查看</span>
    </div>
    <el-row>
      <el-form :model="dialogForm" label-width="120px" ref="dialogForm" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="userName" :rules="[{ required: true, message: '真实姓名不能为空'},{pattern:/^[\u4e00-\u9fa5][\u4e00-\u9fa5a-zA-Z\d]{1,11}$/ ,message:'姓名格式不正确，只能以中文开头长度2-12位'}]">
              <el-input v-model="dialogForm.userName" :disabled="disabled"></el-input><!--placeholder="最多输入100个字符" :maxlength='100'-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录名：" prop="loginId" :rules="[ { required: true, message: '登录名不能为空'},{pattern:/^[A-Za-z0-9_-]{2,16}$/,message:'登录名格式不正确(数字/字母/下划线/横杆)(2-16位)'}]">
              <el-input v-model="dialogForm.loginId" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码：" prop="userPassword" :rules="[{ required: true, message: '密码不能为空'},{pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/, message: '密码格式必须是字母数字组成(长度至少为8位,最大16位,不支持空格)'}]" v-if="oper=='add'">
              <el-input v-model="dialogForm.userPassword" type="password" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码：" prop="checkPass"  :rules="[{required:true,message:'请再次输入密码'},{validator:validatePass,trigger: 'blur'}]" v-if="oper=='add'">
              <el-input v-model="dialogForm.checkPass" type="password" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="mobile" :rules="[{required:true,message:'请输入手机号码'}, {pattern:/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确的手机号码'} ]">
              <el-input v-model="dialogForm.mobile" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱：" prop="email" :rules="[ { required: true, message: '电子邮箱不能为空'}, {type: 'email', message: '请输入正确的电子邮箱'} ]">
              <el-input v-model="dialogForm.email" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属部门：" prop="departId" :rules="[{required:true,message:'请选择所属部门'}]">
              <el-cascader :options="departTree" :props="static.defaultprops"  v-model="dialogForm.departId" :show-all-levels="false" :change-on-select="true" :disabled="disabled">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属地区：" prop="areaId" :rules="[{required:true,message:'请选择所属地区'}]">
              <el-cascader :options="areaTree" :props="static.defaultprops"  v-model="dialogForm.areaId" :show-all-levels="false" :change-on-select="true" :disabled="disabled">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色：" prop="roleIds">
              <el-select v-model="dialogForm.roleIds" :disabled="disabled" multiple style="width: 100%">
                <el-option v-for="item in static.roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
      <span slot="footer" class="dialog-footer">
         <template>
          <el-button @click="dialogVisible =false" size="small">关闭</el-button>
          <el-button type="primary" icon="circle-check" @click="addnewSubmit" v-show="oper==='add' " size="small">提交</el-button>
          <el-button type="primary" icon="circle-check" @click="update" v-show="oper==='modify' " size="small">提交</el-button>
         </template>
      </span>
  </el-dialog>
</div>
</template>
<script>
    import md5 from 'blueimp-md5';
    import {Base64} from 'js-base64';
    import Mixins from '../../mixins/form'
    export default {
        mixins:[Mixins],
        data() {
            return {
              collapseVisible:false,
              dialogVisible :false,
              oper:'',
              disabled:false,
              form:{
                userMap:{
                  loginId:'',
                  userName:'',
                  departId:[]
                }
              },
              tableData:[],
              paginationParams:{
                currentPage:1
              },
              pagination: {
                current: 1,
                size: 10,
                total: 0
              },
              batchRows:[],//存取表格批量或单选中行
              menus: [{
                text: "修改",
                command: "edit",
                // ruleCode: 'userManage_update'
              }, {
                text: "删除",
                command: "del",
                //ruleCode: 'userManage_del'
              }],
              dialogForm:{
                "userName": null,
                "loginId": null,
                "userPassword": null,
                "checkPass": null,
                "mobile": null,
                "telPhone": null,
                "email": null,
                "departId": null,
                "areaId": null,
                "roleIds":[]
              },
              static:{
                roleList:[],
                defaultprops: {
                  value: "dataId",
                  label: "label",
                  children: "children"
                }
              },
              statusList: [ //翻译
                {
                  key: 0,
                  value: '锁定'
                }, {
                  key: 1,
                  value: '正常'
                }
              ],
            }
        },
        methods: {
          clickRow(command, scope) { //点击上下菜单
            if (command === 'del') {
              var arr = {ids:[]};
              arr.ids.push(scope.row.userId);
              this.operBefore('删除',arr.ids).then(()=>{
                this.deleteUser(arr.ids);
              }).catch(()=>{

              });
            } else if (command === 'edit') {
              this.oper='modify';
              this.dialogVisible =true;
              this.userQueryById(scope.row.userId);
            }
          },
          //密码重置
          passwordReset(){
            this.$confirm('确认重置密码？').then(() => {
              this.pswConfirm()
            }).catch(() => {

            });
          },
          pswConfirm:function(){
            var ids = this.batchRows.map(function(item) {
              return item.userId
            });
            var params = {ids:[]};
            params.ids = ids;
            var url="system/user/update/passwordReset"
            this.$fetch.doPost(url,params).then((resp) => {
              if (resp.returnCode == "1") {
              this.$message({
                message: resp.returnMsg,
                type: 'success'
              });
              this.batchRows = [];
              this.query();
              this.$store.dispatch("userQuery");
            } else {
              this.$message({
                message: "重置失败, " + resp.returnMsg,
                type: 'error'
              });
            }
          }, (error) => {
              this.$message({
                message: "重置失败, " + error,
                type: 'error'
              });
            })
          },
          //批量锁定用户
          lockUserView: function(status, text) {
            var temp = null, //记录一个值，用于比对的样本
              ids = [],
              item = null,
              index = 0;
            if (this.batchRows.length == 0) {
              if (status == '0') {
                this.$message.warning(`请选择${text}的用户`);
              } else if (status == '1') {
                this.$message.warning(`请选择${text}的用户`);
              }
              return false;
            }
            for (item of this.batchRows) {
              ids.push(item.userId);
              if (item.userState == status) {
                this.$message(`选中的行中包含了已${text}的`);
                return;
              }
              if (index == 0)
                temp = item
              else {
                if (temp.userState != item.userState) {
                  this.$message(`所选状态不一致，无法进行${text}`);
                  return;
                }
              }
              index++;
            }
            if (status == '0') {
              this.$confirm('确认锁定用户？').then(() => {
                this.lockUser(ids, status);
            }).catch(() => {});
            } else if (status == '1') {
              this.$confirm('确认解锁用户？').then(() => {
                this.lockUser(ids, status);
            }).catch(() => {});
            }
          },
          lockUser(ids, status) {
            var msg = "";
            var duration=3000;
            var showClose=false;
            /*if (status == '0') {
              msg = "解锁";
              duration=0;
              showClose=true;
            } else {
              msg = "锁定";
              duration=3000;
              showClose=false;
            }*/
            var param = {};
            param.ids = ids;
            param.status = status;
            var url="system/user/lock"
            this.$fetch.doPost(url,param).then((resp) => {
              var d = resp;
            if (d.returnCode == "1") {
              this.$message({
                //showClose: showClose,
                message: d.returnMsg,
                type: 'success',
                //duration:duration
              });
              this.batchRows = [];
              this.query();

            } else {
              this.$message({
                message: msg + "失败,Error Info " + d.returnMsg,
                type: 'error'
              });
            }
          }, (error) => {
              this.$message({
                message: msg + "失败,Error Info " + error,
                type: 'error'
              });
            })
          },
          //新增
          addNew:function(){
              this.oper='add';
              this.dialogVisible =true;
          },
          //新增提交
          addnewSubmit() {
            this.$refs["dialogForm"].validate((valid) => {
              if (valid) {
                var params = {

                }
                params = JSON.parse(JSON.stringify(this.dialogForm));
                params.userPassword = md5(Base64.encode(params.userPassword));
                params.checkPass = md5(Base64.encode(params.checkPass));
                params.departId = this.toForamt(params.departId)
                params.areaId = this.toForamt(params.areaId)
                var url="system/user/add"
                this.$fetch.doPost(url,params).then((resp) => {
                  if (resp.returnCode == "1") {
                  this.$message({
                    message: resp.returnMsg,
                    type: 'success'
                  });
                  this.dialogVisible = false;
                  this.query();
                  this.$store.dispatch("userQuery");
                } else {
                  this.$message({
                    message: "新增失败, " + resp.returnMsg,
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

          //修改提交
          update:function(){
            this.$refs["dialogForm"].validate((valid) => {
              if (valid) {
                var params = {

                }
                params = JSON.parse(JSON.stringify(this.dialogForm));
                params.departId = this.toForamt(params.departId)
                params.areaId = this.toForamt(params.areaId)
                var url="system/user/update"
                this.$fetch.doPost(url,params).then((resp) => {
                  if (resp.returnCode == "1") {
                  this.$message({
                    message: resp.returnMsg,
                    type: 'success'
                  });
                  this.dialogVisible = false;
                  this.query();
                  this.$store.dispatch("userQuery");
                } else {
                  this.$message({
                    message: "修改失败, " + resp.returnMsg,
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
          //查看单条数据
          userQueryById:function(id){
            var url="system/user/query"
            this.$fetch.doGet(url,id).then((resp) => {
              if (resp.returnCode == "1") {
              this.dialogForm=resp.data;
              this.dialogForm.areaId = this.$util.getCascaderSelectIds(this.areaTree,this.dialogForm.areaId,'dataId','children');
              this.dialogForm.departId = this.$util.getCascaderSelectIds(this.departTree,this.dialogForm.departId,'dataId','children');
            } else {
              this.$message.error(resp.returnMsg);
            }
          }, (error) => {
              this.$message.error(error);
            })
          },
          validatePass:function(rule,value,callback){
           if(value!=this.dialogForm.userPassword){
              callback(new Error("两次输入密码不一致"))
            }else {
             callback();
           }
          },
          /*处理表格全选和单选按钮*/
          doSelectAllHandle: function(selection) {
            this.batchRows = selection;
          },
          doSelectHandle: function(selection, row) {
            this.batchRows = selection;
          },
          //删除
          batchDelete() {
            var ids = this.batchRows.map(function(item) {
              return item.userId
            });
            this.operBefore('删除',ids).then(()=>{
              this.deleteUser(ids);
             }).catch(()=>{

            });
          },

          deleteUser(ids) {
            var params = {ids:[]};
            params.ids = ids;
            var url="system/user/delete"
            this.$fetch.doPost(url,params).then((resp) => {
            if (resp.returnCode == "1") {
              this.$message({
                message: resp.returnMsg,
                type: 'success'
              });
              this.batchRows = [];
              this.query();
              this.$store.dispatch("userQuery");
            } else {
              this.$message({
                message: "删除失败, " + resp.returnMsg,
                type: 'error'
              });
            }
          }, (error) => {
              this.$message({
                message: "删除失败, " + error,
                type: 'error'
              });
            })
          },
            handleSizeChange:function(pageSize){
              this.pagination.size=pageSize;
              this.query()
            },
            //currentPage 改变时会触发
            handleCurrentChange:function(currentPage){
              this.pagination.current=currentPage
              this.query()
            },
            query:function(){
              var params = {
                userMap: null,
                page: null
              }
              params.userMap = JSON.parse(JSON.stringify(this.form.userMap));
              if(params.userMap.departId.length){
                params.userMap.departId=params.userMap.departId.splice(-1)[0];
              }else{
                params.userMap.departId="";
              }

              params.page = this.pagination;
              var url="system/user/query"
              this.$fetch.doPost(url,params,true).then((rep) => {
                this.tableData = rep.data.list;
                this.pagination.total = rep.data.page.total;
            }, (error) => {
                this.$message.error(error);
              })
            },
            roleRule:function(){
              var url="system/role/query/roleRuleSelect"
              this.$fetch.doGet(url).then((rep) => {
                if (rep.returnCode == "1") {
                this.static.roleList = rep.data;
              }
            }, (error) => {
                this.$message.error(error);
              })
            },
            toForamt(value) { //转换主要级联选择时，返回最后数组元素
              if (value instanceof Array)
                return value.splice(-1)[0]
              else
                return value
            },
        },
        computed: {
          departTree: function () {
            return this.$store.getters.departTree
          },
          areaTree: function () {
            return this.$store.getters.areaTree
          },
        },
        mounted() {
          this.roleRule();
          this.query();
        }
    }
</script>
