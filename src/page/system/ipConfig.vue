<template>
  <base-layout :fBorder="false" :cBorder="false">
    <div slot="header" style="position: relative">
      <span>IP管理</span>
      <div class="tabList">
        <span><router-link to="userIpCfg">用户IP限制</router-link></span>
        <span><router-link to="depIpCfg">部门IP限制</router-link></span>
        <i style="font-style: normal">限制开关<el-switch v-model="switchTag" :active-value="1" :inactive-value="0" @change="changeSwitch"></el-switch></i>
      </div>

    </div>
    <router-view></router-view>
  </base-layout>
</template>

<script>
  export default{
    name:'ipConfig',
    data(){
      return {
        switchTag:"1"
      }
    },
    methods:{
      changeSwitch(val){
        if(val==1){
          this.$confirm('确认开启IP限制？').then(() => {
            this.confirmSwitch(val)
          }).catch(() => {
            this.switchTag=0
          });
        }else{
          this.$confirm('确认关闭IP限制？').then(() => {
            this.confirmSwitch(val)
          }).catch(() => {
            this.switchTag=1
          });
        }
      },
      confirmSwitch(val){
        let url='system/ipWhiteListSwitch';
        let params={switchOn:''};
        params.switchOn=val.toString();
        this.$fetch.doPost(url,params).then((resp)=>{
          if(resp.returnCode==1){
            this.$message.success(resp.returnMsg);
          }else{
            this.$message.error(resp.returnMsg);
          }
        },(error)=>{
          this.$message.error(error.message);
        })
      },
      getSwitch(){
        let url='system/ipWhiteListSwitchQuery';
        this.$fetch.doGet(url).then((resp)=>{
          if(resp.returnCode==1){
            this.switchTag=Number(resp.data)
          console.log(this.switchTag)
          }else{
            this.$message.error(resp.returnMsg);
          }
        },(error)=>{
          this.$message.error(error.message);
        })
      }
    },
    mounted(){
      this.getSwitch();
    }
  }
</script>
