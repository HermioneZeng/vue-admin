<template>
  <div>
    <p class="title">找回密码<i class="el-icon-close close" @click="$router.go(-1)"></i></p>
    <div class="stepWrapper">
      <el-steps :active="active" align-center finish-status="success" style="margin-bottom: 30px">
        <el-step title="验证身份"></el-step>
        <el-step title="修改登录密码"></el-step>
        <el-step title="修改成功"></el-step>
      </el-steps>
      <div v-show="active1" class="stepBox">
        <el-row>
          <el-col :span="14">
            <el-form  label-width="110px" :model="queryParams" ref="queryParams">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="验证方式：">
                    <el-select v-model="queryParams.loginType" style="width:100%" @change="changeValidWay">
                      <el-option v-for="item in validWays" :label="item.label" :key="item.value" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" v-if="userPhone">
                  <el-form-item label="手机号码：" prop="mobilePhone" :rules="[ { required: userPhone, message: '请输入手机号码',trigger: 'change'},{validator:validatePhone,trigger: 'blur'}]">
                    <el-input v-model="queryParams.mobilePhone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="!userPhone">
                  <el-form-item label="用户名：" prop="loginId" :rules="[ { required: !userPhone, message: '请输入用户名',trigger: 'change'}]">
                    <el-input v-model="queryParams.loginId"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12" >
                  <el-form-item label="验证码：" prop="checkCode" :rules="[ { required: true, message: '验证码不能为空',trigger: 'change'}]">
                    <el-input v-model="queryParams.checkCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1" style="margin-top: 8px">
                  <el-button size="small" @click="getValid" :disabled="disabled">{{activeText}}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div v-show="active2" class="stepBox">
        <el-row>
          <el-col :span="14">
            <el-form label-width="110px" :model="pswParams" ref="pswParams">
              <el-col :span="24">
                <el-form-item label="新密码：" prop="password" :rules="[ { required: true, message: '新密码不能为空'},{pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/, message: '密码格式必须是字母数字组成(长度至少为8位,最大16位,不支持空格)'},{validator:validatePass,trigger: 'blur'} ]">
                  <el-input type="password" v-model="pswParams.password"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="确认密码：" prop="checkPass" class="is-required" :rules="[{validator:validatePass2,trigger: 'blur'}]">
                  <el-input type="password" v-model="pswParams.checkPass"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div v-show="active3" class="stepBox">
        <el-row>
          <el-col :span="10" :offset="5">
            <el-row>
              <el-col :span="4"><i class="el-icon-check successIcon"></i></el-col>
              <el-col :span="20">
                <p style="font-size: 18px;margin-bottom: 12px">重置登录密码成功！{{activeText2}}秒后返回登录页面</p>
                <p class="enterLoginPage"><router-link to='/'>点击直接进入登录页面</router-link></p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <el-button @click="next" type="primary" size="large" v-show="nextBtn" class="nextBtn">下一步</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'forgetPsw',
    data() {
      return {
        active: 0,
        active1: true,
        active2: false,
        active3: false,
        nextBtn:true,
        disabled:false,
        second:60,
        activeText:'获取验证码',
        second2:10,
        activeText2:'',
        userPhone:true,
        validWays:[
          {
            label: '使用手机验证',
            value : '3'
          },
          {
            label: '使用用户名验证',
            value: '2'
          }
        ],
        queryParams: {
            loginId: null,
            loginType: '3', //1用户名+密码+图片验证码登录, 2用户名+密码+手机验证码登录, 3手机号码+手机验证码
            mobilePhone: null,
            checkCode: null,
            password: null
        },
        pswParams:{
          password: null,
          checkPass:null
        },
      }
    },
    methods:{
      changeValidWay:function(label){
        if(label==3){
          this.userPhone=true;
        }else{
          this.userPhone=false;
        }
        this.$refs.queryParams.resetFields();
      },
      validatePass(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      },
      validatePass2(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pswParams.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      validatePhone(rule, value, callback) {
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('手机号码格式错误'));
        }else{
          callback();
        }
      },
      //获取手机验证码前的参数为空判断
      getValid:function() {
        if(this.userPhone){
          if(!this.queryParams.mobilePhone){
            this.$message.warning('请先输入手机号码');
          }else if(!(/^1[34578]\d{9}$/.test(this.queryParams.mobilePhone))){
            //this.$message.warning('手机号码格式错误');
          } else{
            this.getMobileCheckCode()
          }
        }else{
          if(!this.queryParams.loginId||this.queryParams.loginId.trim()==''){
            this.$message.warning('请先输入用户名');
          }else{
            this.getMobileCheckCode()
          }
        }
      },
      //获取手机验证码
      getMobileCheckCode:function(){
        this.updateCountDown();
        this.$fetch.getMobileCheckCode(this.queryParams).then((resp) => {
          if (resp.data.returnCode != '0') {
          this.$message.error(resp.data.returnMsg + "");
          this.second = 0;
        }
      }, (error) => {
          this.$message.error(error + "");
          this.second = 0;
        });
      },
      updateCountDown: function() {
        if (this.second == 0) {
          this.activeText = "获取验证码";
          this.disabled = false;
          this.second = 60;
        } else {
          this.second--;
          this.activeText=this.second+'秒后重新获取';
          this.disabled=true;
          setTimeout(() => {
            this.updateCountDown();
        }, 1000)
        }
      },
      updateCountDown2: function() {
        this.second2--;
        this.activeText2=this.second2;
        if(this.second2==0){
          this.$router.push({ path: '/' })
        }
        setTimeout(() => {
          this.updateCountDown2();
      }, 1000)
      },
      next:function(){
        if (this.active==0) {
          this.$refs["queryParams"].validate((valid) => {
            if (valid) {
              this.$fetch.mobileCheckCodeVerify(this.queryParams).then((resp) => {
              if (resp.data.returnCode != '0') {
                this.$message.error(resp.data.returnMsg + "");
              } else {
                this.active += 1;
                this.active1 = false;
                this.active2 = true;
                this.active3 = false;
              }
            }, (error) => {
                this.$message.error(error + "");
                this.second = 0;
              });
            }
          })

        } else if (this.active==1) {
          this.$refs["pswParams"].validate((valid) => {
            if (valid) {
              this.queryParams.password = this.pswParams.password;
              this.$fetch.forgetPswChangePsw(this.queryParams).then((resp) => {
                console.log("forgetPswChangePsw resp " + JSON.stringify(resp));
              if (resp.data.returnCode != '0') {
                this.$message.error(resp.data.returnMsg + "");
              } else {
                this.active += 1;
                this.active1 = false;
                this.active2 = false;
                this.active3 = true;
                this.nextBtn = false;
                this.updateCountDown2();
              }
            }, (error) => {
                this.$message.error(error + "");
                this.second = 0;
              });
            }
          })
        }
      }
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
  .stepWrapper{
    padding: 50px 100px;
    margin-left: 160px ;
  }

  .nextBtn{
    width: 200px;
    margin-left: 110px;
    margin-top: 20px
  }
  .successIcon{
    border: 2px solid #13ce66;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #13ce66;
    margin-right: 50px;
  }
  .enterLoginPage a{
    color: #1d90e6;
    font-size: 14px;
  }
</style>
