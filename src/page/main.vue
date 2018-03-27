<template>
    <div class="container">
        <div class="a-topbar">
            <div class="a-topbar-warpper clearfix">
                <div class="a-topbar-head-left">
                    <div class="logo">
                        <span class="text">
                        </span>
                        <span class="sub-title">OMS订单管理系统</span>
                    </div>
                </div>
                <div class="a-topbar-head-right">
                    <div class="login-info">
                        <span class="user" @click="changeUserInfo">
                            <span class="user-head">
                                <img src="../../static/imgs/head.png" />
                            </span>{{userName}}
                        </span>
                        <span class="split_line"></span>
                        <span class="close" @click="logOff">
                            <img src="../../static/imgs/close.png" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="a-sidebar">
                <accordion></accordion>
        </div>
        <div class="a-product">
            <div class="loading" style="height:100%;">
                <router-view></router-view>
            </div>
        </div>
      <!--用户信息-->
      <el-dialog :visible.sync="showDialog" @close="clearForm">
        <el-tabs v-model="activeName" class="twoTabs">
          <el-tab-pane label="基本信息" name="first">
            <el-form  label-width="130px" :model="dialogForm" ref="dialogForm" size="small">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：" prop="userName" :rules="[ { required: true, message: '姓名不能为空'}]">
                    <el-input v-model="dialogForm.userName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="登录名：" prop="loginId" :rules="[ { required: true, message: '登录名不能为空'},{pattern:/^[A-Za-z0-9_-]{2,16}$/,message:'请输入正确的登录名格式(数字/字母/下划线/横线)(2-16位)'}]">
                    <el-input v-model="dialogForm.loginId" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="手机号码：" prop="mobile" :rules="[ { required: true, message: '手机不能为空'}, {pattern:/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确的手机号码'} ]">
                    <el-input v-model="dialogForm.mobile"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电子邮箱：" prop="email" :rules="[ { required: true, message: 'email不能为空'}, {type: 'email', message: '请输入正确的email格式'} ]">
                    <el-input v-model="dialogForm.email"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="所属部门：" prop="departId" :rules="[ { required: true, message: '部门不能为空'}]">
                    <el-cascader :options="departTree" :show-all-levels="false" :props='propsDefault' v-model="dialogForm.departId" :change-on-select="true"></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="地域：" prop="areaId">
                    <el-cascader :options="areaTree" :show-all-levels="false" :props='propsDefault' v-model="dialogForm.areaId" :change-on-select="true" style="width: 100%"></el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="角色：" prop="roleIds">
                    <el-select v-model="dialogForm.roleIds" multiple placeholder="请选择" style="width:100%;">
                      <el-option v-for="item in roleRuleSelect" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="密码修改" name="second">
            <el-form  label-width="135px" :model="passwordForm" ref="passwordForm" size="small">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="旧密码：" prop="oldPassword" :rules="[ { required: true, message: '旧密码不能为空'}]">
                    <el-input type="password" v-model="passwordForm.oldPassword"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="新密码：" prop="userPassword" :rules="[ { required: true, message: '新密码不能为空'},{pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/, message: '密码格式必须是字母数字组成(长度至少为8位,最大16位,不支持空格)'},{validator:validatePass,trigger: 'blur'} ]">
                    <el-input type="password" v-model="passwordForm.userPassword"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="再次输入密码：" prop="checkPass" class="is-required" :rules="[{validator:validatePass2,trigger: 'blur'}]">
                    <el-input type="password" v-model="passwordForm.checkPass"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog=false">关闭</el-button>
          <el-button type="primary" @click="updSubmit" v-if="activeName=='first'">基本信息修改</el-button>
          <el-button type="primary" @click="updPassword" v-if="activeName!='first'">密码修改</el-button>
        </span>
      </el-dialog>
      <el-dialog class="updPswSuccess" :visible.sync="updPswSuccess" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-row>
          <el-col :span="18" :offset="3">
            <el-row>
              <el-col :span="3"><i class="el-icon-check successIcon"></i></el-col>
              <el-col :span="20" :offset="1">
                <p style="font-size: 18px;margin-bottom: 12px">重置登录密码成功！{{activeText}}秒后返回登录页面</p>
                <p class="enterLoginPage"><router-link to='/'>点击直接进入登录页面</router-link></p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
</template>

<script>
import accordion from '../components/sidebar/accordion.vue'
import '../assets/css/reset.css'
import '../assets/css/base.styl'
import Mixins from '../mixins/form'
import md5 from 'blueimp-md5';
import {Base64} from 'js-base64';
export default {
    mixins:[Mixins],
    data() {
        return {
            showDialog:false,
            updPswSuccess:false,
            second: 10,
            activeText:'',
            activeName:'first',
            roleRuleSelect:[],
            dialogForm: {
              userId: null, // 用户id
              areaId: null, //地域	number
              departId: null, //组织架构,部门	number
              email: "", //string
              loginId: "", //登录名	string
              mobile: "", //	手机号码	string
              userName: "", //	用户名称	string
              roleIds: [], //角色数据
            },
            passwordForm:{
              userPassword: "", //密码	string
              oldPassword: "",
              checkPass: "", //检测密码
            },
          propsDefault: {
            label: 'label',
            value: 'dataId',
            children: "children"
          },
        }
    },
    methods: {
      //修改用户信息
      changeUserInfo:function(){
        this.showDialog=true;
        this.activeName='first';
        this.getBasicInfo();
      },
      //获取基本信息
      getBasicInfo:function(){
        var params = this.userId || 0;
        var url='system/user/queryLoginUser'
        this.$fetch.doGet(url).then((resp) => {
          var d = resp,
          keys = [],
          form = this.dialogForm,
          resUser = d.data;
        if (d.returnCode == "1") {
          keys = Object.keys(this.dialogForm);
          for (let key of keys) {
            form[key] = resUser[key]
          }
          form.roleIds = d.data.roleIds;
          form.areaId = this.$util.getCascaderSelectIds(this.$store.getters.areaTree, form.areaId, 'dataId', 'children');
          form.departId = this.$util.getCascaderSelectIds(this.$store.getters.departTree, form.departId, 'dataId', 'children');
        } else {
          this.$message.error(error);
        }
      }, (error) => {
          this.$message.error(error);
        })
      },
      //修改基本信息
      updSubmit:function(){
        this.$refs["dialogForm"].validate((valid) => {
          if (valid) {
            var params = {};
            params.roleIds = this.dialogForm.roleIds;
            params.user = JSON.parse(JSON.stringify(this.dialogForm));
            params.user.areaId = this.toForamt(params.user.areaId)
            params.user.departId = this.toForamt(params.user.departId)
            var url='system/user/update'
            this.$fetch.doPost(url,params.user).then((resp) => {
              var d = resp;
            if (d.returnCode == "1") {
              this.$message({
                message: d.returnMsg,
                type: 'success'
              });
              this.$refs.dialogForm.resetFields();
              this.showDialog = false;
              this.$store.dispatch("querySOCUser");
            } else {
              this.$message({
                message: "修改失败，" + d.returnMsg,
                type: 'error'
              });
            }
          }, (error) => {
              this.$message({
                message: "修改失败，" + error,
                type: 'error'
              });
            })
          } else {
            return false;
          }
        });
      },
      //修改密码
      updPassword:function(){
        var that = this;
        this.passwordForm.userId = this.userId;
        var clone = JSON.parse(JSON.stringify(this.passwordForm));
        clone.userPassword = md5(Base64.encode(clone.userPassword));
        clone.checkPass = md5(Base64.encode(clone.checkPass));
        clone.oldPassword = md5(Base64.encode(clone.oldPassword));
        var url='system/user/update/passwordCheckOld'
        this.$fetch.doPost(url,clone).then(
          (resp) => {
          if (resp.returnCode == "1") {
          this.showDialog=false;
          this.updPswSuccess=true;
          this.updateCountDown()
        } else {
          that.$message.error(resp.returnMsg)
        }
      }, (error) => {
          that.$message.error(error)
        }
        )
      },
      updateCountDown: function() {
        this.second--;
        this.activeText=this.second;
        if(this.second==0){
          this.$router.push({ path: '/' })
        }
        setTimeout(() => {
          this.updateCountDown();
      }, 1000)
      },
      clearForm(){
        //this.resetForm('dialogForm')
        this.resetForm('passwordForm');

      },
      toForamt(value) { //转换主要级联选择时，返回最后数组元素
        if (value instanceof Array)
          return value.splice(-1)[0]
        else
          return value
      },
      //获取角色
      queryRoleRule: function() {
        var url='system/role/query/roleRuleSelect'
        this.$fetch.doGet(url).then((rep) => {
          if (rep.returnCode == 1){
            this.roleRuleSelect = rep.data || []
          }else{
            this.$message.error(rep.returnMsg)
          }
        }, (error) => {
          this.$message.error("获取下拉角色列表错误：" + error)
        })
      },
      logOff:function(){
        var params = {userId: this.userId, userName: this.userName};
        var url='system/logout'
        this.$fetch.doPost(url,params).then((resp) => {
          if (resp.returnCode == "1") {
            this.$store.commit('setMenus',[]);
            this.$store.commit('setUserName','');
            this.$store.commit('setDepartName','');
            this.$store.commit('setUserId','');
            this.$store.commit('setRuleCodes', []);
            this.$store.commit('setAuthorization','');
            this.$router.push({ name: 'login'});
          } else {
            this.$message({
              message: "退出失败，" + resp.returnMsg,
              type: 'error'
            });
          }
        }, (error) => {
          this.$message({
            message: "退出失败，" + error,
            type: 'error'
          });
        });
      },
      validatePass(rule, value, callback) {
        if (value == this.passwordForm.oldPassword) {
          callback(new Error('新密码不能与旧密码相同'));
        } else {
          callback();
        }
      },
      validatePass2(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordForm.userPassword) {
          callback(new Error('两次输入密码不一致！'));
        } else {
          callback();
        }
      },
    },
    components: {
        accordion
    },
    computed: {
      areaTree: function() {
        return this.$store.getters.areaTree;
      },
      departTree: function() {
        return this.$store.getters.departTree;
      },
      userName: function(){
        return this.$store.getters.userName;
      },
      userId: function(){
        return this.$store.getters.userId;
      },
      departName: function(){
        return this.$store.getters.depart;
      }
    },
    mounted() {
      //加载全局静态参数
      this.$store.dispatch('getAreaTree');
      this.$store.dispatch('getDeptTree');
    },
    created() {
      this.queryRoleRule();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
    @import "../assets/css/variables.styl"
    $height  = 54px
    .container
        height:100%
        width:100%
        .a-topbar
            height:$height
            background-color:bg-color
      .a-sidebar
            position:fixed
            top:$height
            bottom:0
            width:170px
            background:nav-bg-color
            overflow:hidden
        .a-product
            position:absolute;
            left:170px
            top:$height
            right:0
            bottom:0
            background:#fff;
    .a-sidebar,
    .a-product
        overflow-x:hidden
        overflow-y:auto
    .a-topbar-head-left
        float:left
        line-height:0
    .logo
       /*padding-left:80px
       background-image:url('../../static/imgs/logo.png')
       background-repeat:no-repeat
       background-position: 25px 50%
       background-origin: border-box*/
    .text,
    .sub-title
        font-size:18px
        color:#e7f1fd
        display: inline-block
        line-height: $height
        vertical-align: top
    .sub-title
        font-size:18px;
        margin-left:10px;
    .a-topbar-head-right
        float:right
        .login-info
            display:inline-block
            height:$height
            line-height:$height
            span
                color:#dfdfdf
                font-size:12px
            .close
                img
                    display:inline
                    vertical-align: middle
                    margin-top: -3px
            .split_line
                display:inline-block
                height:26px
                border-left:1px solid #838281
                vertical-align: middle
    .department,
    .user,
    .close,
    .tip
        line-height:1.2
        cursor:pointer
        padding:1px 21px
        display:inline-block
    .tip
        img
            margin-right:6px
            vertical-align: middle
    .exportFileDot
        sup
            border: 0px solid #fff
    .user
        .user-head
            margin-right:12px
            vertical-align: middle
            display:inline-block
            width:33px
            height:33px
            text-align:center
            border-radius: 50%
            overflow:hidden
            background:#599aec

    .msg-box
       max-height:474px
       margin:-10px
       font-size:0;
       .msg-box-title
            height:54px
            line-height:54px
            font-size:14px
            padding-left:22px
       .msg-list
            display:table
            border-spacing:0
            width:100%
            .msg-item
                border-bottom:1px solid #e0e0e0
                .cell
                    font-size:12px
                    width:100%
                    display:table-cell
                    height:71px
                    vertical-align: middle
                    padding:0 22px
                    p
                        line-height: 1.5
                        padding:5px 0
                        color:#175dc5
                        overflow: hidden
                        text-overflow: ellipsis
                        white-space: nowrap
                        max-width : 396px
                        cursor : pointer
                    span
                        color:#888888
            .msg-item:first-child
                border-top:1px solid #e0e0e0
            .msg-item:last-child
                border-bottom:0
        .msg-more
            border-top:1px solid #e0e0e0
            border-bottom:1px solid #e0e0e0
            background:#fafafa
            cursor:pointer
            font-size:14px
            height:64px
            text-align:center
            line-height:64px
            a
                display:block
                color:#333333
        .el-tooltip__popper
            max-width : 400px
</style>
<style lang="stylus">
.exportFileDot
    sup
        border: 0px solid #fff
.msgBoxTip
    .el-alert--success
        background-color:white
        color: #13ce66
        .el-alert__icon
            color: #13ce66
        .el-alert__content
            .el-alert__description
                color: #13ce66


.updPswSuccess .el-dialog__header
  height:0
  border-bottom:0
</style>

