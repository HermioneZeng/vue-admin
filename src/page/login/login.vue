<template>
  <div class="loginPage" @keyup.enter="login">
    <div class="loginLogo">
     <!-- <img src="./imgs/loginlogo.png">-->
    </div>
    <div class="loginMain" style="margin-top: 100px;">
      <div class="loginForm">
        <p class="formHead">{{tipTitle}}<span class="changeLoginWay" v-show="showTipText" @click="changeLoginWay">{{tipText}}</span></p>
        <el-form :rules="rules" ref="ruleForm" :model="queryParams">
          <!--账号登录-->
          <div class="accountLogin" v-if="LoginWay">
            <el-form-item prop="loginId">
              <el-input v-model="queryParams.loginId" placeholder="请输入用户名"></el-input>
              <icon name="user"></icon>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="queryParams.password" type="password" placeholder="请输入密码"></el-input>
              <icon name="key"></icon>
            </el-form-item>
            <el-row>
              <el-col :span="16">
                <el-form-item class="verCodeInput" prop="checkCode">
                  <el-input v-model="queryParams.checkCode" placeholder="请输入验证码"></el-input>
                  <icon name="th"></icon>
                </el-form-item>
              </el-col>
              <el-col :span="7" :offset="1">
                <img :src="imgURL" @click="getCaptcha" style="height:47px;width:78px">
              </el-col>
            </el-row>
          </div>
          <el-form-item>
            <el-checkbox v-model="checked" @change="rememberPsw">记住密码</el-checkbox><!--<router-link to="/main/forgetPsw" class="forgetPsw" v-show="LoginWay2">忘记密码？</router-link>-->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="loginBtn" @click="login">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../assets/css/base.styl'
  import md5 from 'blueimp-md5';
  import {Base64} from 'js-base64';
  export default {
    data() {
      return {
        checked: false,
        LoginWay:true,
        tipTitle:"账号登录",
        tipText:"手机快捷登录",
        second:60,
        activeText:'获取验证码',
        disabled:false,
        LoginWay2:false,
        showTipText:false,
        LoginWay3:false,
        //请求参数
        queryParams: {
          loginId: '',
          password: '',
          checkCode: '',
          //captcha: null,
          //loginType: 1, //1用户名+密码+图片验证码登录, 2用户名+密码+手机验证码登录, 3手机号码+手机验证码
          //mobilePhone: null
        },
        imgURL: '',
        //数据验证
        rules: {
           loginId: [{
             required: true,
             message: '请输入用户名',
             trigger: 'blur'
           }],
           password: [{
             required: true,
             message: '请输入密码',
             trigger: 'blur'
           }],
           checkCode: [{
             required: true,
             message: '请输入验证码',
             trigger: 'change'
           }]
        },
        updateCountDown:null,
        redirect:''
      }
    },
    methods: {
      //复选框勾选状态发生改变时，如果未勾选则清除cookie
      rememberPsw(){
        if(!this.checked){
          this.delCookie('user');
          this.delCookie('pswd');
        }
      },
      //设置cookie
       setCookie(name,value,day){
        var date = new Date();
        date.setDate(date.getDate() + day);
        document.cookie = name + '=' + value + ';expires='+ date;
      },
      //获取cookie
      getCookie(name){
        var reg = RegExp(name+'=([^;]+)');
        var arr = document.cookie.match(reg);
        if(arr){
          return arr[1];
        }else{
          return '';
        }
      },
      //删除cookie
      delCookie(name){
        this.setCookie(name,null,-1);
      },
      //校验
      validatePhone(rule, value, callback) {
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('手机号码格式错误'));
        }else{
          callback();
        }
      },
      changeLoginWay:function(){

      },
      //获取手机验证码
      getMobileCheckCode:function() {
        if(!this.queryParams.mobilePhone){
          this.$message.warning('请先输入手机号码');
        }else if(!(/^1[34578]\d{9}$/.test(this.queryParams.mobilePhone))){
          //this.$message.warning('手机号码格式错误');
        }else{
          this.queryParams.loginType=3;
          this.updateSecond();
          this.$fetch.getMobileCheckCode(this.queryParams).then((resp) => {
          if (resp.data.returnCode != '0') {
            this.$message.error(resp.data.returnMsg + "");
            this.clearSecond();
          }
        }, (error) => {
            this.$message.error(error + "");
            this.clearSecond();
          });
        }
      },
      //验证码倒计时
      updateSecond:function(){
        this.second = 60;
        this.activeText=this.second+'s';
        this.disabled = true;
        this.updateCountDown=setInterval(()=>{
         if (this.second == 0) {
            this.clearSecond();
          } else{
            this.second--;
            this.activeText = this.second + 's';
          }
        },1000)
      },
      //清除定时器
      clearSecond:function(){
        clearInterval(this.updateCountDown);
        this.activeText = "获取验证码";
        this.disabled=false;
      },
      login:function(){
        this.clearSecond();
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            var clone = JSON.parse(JSON.stringify(this.queryParams));
            clone.password = md5(Base64.encode(clone.password))
            var url='/system/login'
            this.$fetch.doPost(url,clone).then((resp) => {
              if (resp.returnCode == "1") {
                //表单提交事件触发时，如果复选框是勾选状态则保存cookie
                if(this.checked){
                  this.setCookie('user',clone.loginId,7); //保存帐号到cookie，有效期7天
                  //this.setCookie('pswd',Base64.encode(this.queryParams.password),7); //保存密码到cookie，有效期7天
                  this.setCookie('pswd',clone.password,7); //保存密码到cookie，有效期7天
                }
                var data = resp.data,
                    menus = data.menuTree,
                    children = (menus && menus.children) || [],
                    path = "";
                this.$store.commit('setMenus',menus);
                this.$store.commit('setDepartName',data.depart);
                this.$store.commit('setUserId',data.userId);
                this.$store.commit('setUserName',data.userName);
                this.$store.commit('setRuleCodes', data.buttonAuth || []);
                this.$store.commit('setAuthorization',data.authorization);
                var query = this.$route.query;
                if(query.redirect)
                  this.$router.push({
                    path: query.redirect
                  })
                else
                  this.$router.push({
                    path: '/main/instockOrder'
                  })
                // if(children.length){
                //   path = children[0].route
                //   this.$router.push({
                //     path: path
                //   })
                // }else{
                //   this.$message.warning("没有权限访问其它页面！ 请联系管理员");
                // }
            } else if (resp.returnCode == "900") {
              this.getCaptcha();
              this.queryParams.checkCode = "";
              this.$message.warning(resp.returnMsg);
            }else if(resp.returnCode == "2013" || resp.returnCode == "2015"){
              this.$message.error(resp.returnMsg + "");
              this.getCaptcha(); //刷新验证码
              this.queryParams.checkCode = "";
            }else if(resp.returnCode == "800"){
              let userId=resp.data;
              this.$router.push({name:"updPassword", params:{id:userId}})
            } else{
              this.getCaptcha();
              this.queryParams.checkCode = "";
              this.$message.error(resp.returnMsg + "");
            }
          }, (error) => {
              this.$message.error(error + "");
            })
          } else {
            return false;
          }
        })
      },
      getCaptcha: function() {
         this.$fetch.getCaptchaUrl().then((resp)=>{
            this.imgURL = resp;
         },()=>{
            this.imgURL = "";
         })
      },

    },
    computed:{
    },
    mounted: function() {
      //页面初始化时，如果帐号密码cookie存在则填充
      if(this.getCookie('user') && this.getCookie('pswd')){
        this.queryParams.loginId = this.getCookie('user');
        this.queryParams.password = Base64.decode(this.getCookie('pswd'));
       // this.queryParams.password = this.getCookie('pswd');
        this.checked = true;
      }
      var url='/system/getToken'
      this.$fetch.doGet(url).then((resp)=>{
        var authorization = resp.data;
        if(resp.returnCode == '1'){
          this.$store.commit('setAuthorization',authorization);
        }
      }).then(()=>{
          this.getCaptcha();
      })
    }
  }
</script>
