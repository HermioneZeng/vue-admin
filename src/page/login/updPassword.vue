<template>
  <div style="overflow: hidden">
    <p class="title">强制改密<i class="el-icon-close close" @click="$router.go(-1)"></i></p>
    <div class="successTip">
        <el-alert v-show="updPswSuccess"
                  :title=activeText
                  type="success"
                  show-icon :closable="false">
          <div><router-link to="/">点击直接进入登录页面</router-link></div>
        </el-alert>
    </div>

    <el-row style="margin-top: 80px">
      <el-col :span="10" :offset="5">
        <el-form :model="passwordParams" ref="passwordParams" label-width="100px">
          <el-row>
            <el-form-item label="旧密码：" prop="oldPassword" :rules="[ { required: true, message: '旧密码不能为空'}]">
              <el-input type="password" v-model="passwordParams.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="userPassword" :rules="[ { required: true, message: '新密码不能为空'},{pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/, message: '密码格式必须是字母数字组成(长度至少为8位,最大16位,不支持空格)'},{validator:validatePass,trigger: 'blur'}  ]">
              <el-input type="password" v-model="passwordParams.userPassword"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="确认密码：" prop="checkPass" class="is-required" :rules="[{validator:validatePass2,trigger: 'blur'}]">
              <el-input type="password" v-model="passwordParams.checkPass"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="5" :offset="5">
              <el-button type="primary" @click="submitPsw" size="large" style="width: 200px;margin-top: 20px">确认</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'updPassword',
    data() {
      return {
        updPswSuccess:false,
        activeText:"修改登录密码成功！10秒后返回登录页面",
        second: 10,
        passwordParams:{
          userId:null,
          userPassword:null,
          checkPass:null
        }
      }
    },
    methods:{
      submitPsw:function(){
        this.$refs["passwordParams"].validate((valid) => {
          if (valid) {
            this.$fetch.modifyPasswordCheckOld(this.passwordParams).then((resp) => {
              var d = resp.data;
            if (d.returnCode == "0") {
              this.updPswSuccess=true;
              this.updateCountDown()
            } else {
              this.$message.error("修改失败，" + d.returnMsg);
            }
          }, (error) => {
              this.$message.error(error);
            })

          }else{
            return false;
          }
        })
      },
      updateCountDown: function() {
        this.second--;
        this.activeText="修改登录密码成功！"+this.second+"秒后返回登录页面";
        if(this.second==0){
          this.$router.push({ path: '/' })
        }
        setTimeout(() => {
          this.updateCountDown();
        }, 1000)
      },
      validatePass(rule, value, callback) {
        if (value == this.passwordParams.oldPassword) {
          callback(new Error('新密码不能与旧密码相同'));
        } else {
          callback();
        }
      },
      validatePass2(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordParams.userPassword) {
          callback(new Error('两次输入密码不一致！'));
        } else {
          callback();
        }
      },
    },
    mounted(){
      this.passwordParams.userId = this.$route.params.id;
    }
  }

</script>
<style scoped>
  .title{
    height:70px;
    line-height: 70px;
    padding-left: 20px;
    border-bottom:1px solid #e7e7e7;
    background-color: #fbfbf8;
  }
</style>
