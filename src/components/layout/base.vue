<template>
  <div class="box">
    <div class="title" :class="{border:tBorder}" v-show="showHeader">
      <slot name="header"></slot>
    </div>
    <div class="search_form" :class="{border:fBorder}">
       <slot name="form_content"></slot>
    </div>
    <div class="tableInfo" :class="{border:cBorder}">
       <slot name="table_content"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    data(){
      return {
      }
    },
    mounted(){
    },
    computed: {
    },
    props:{
      showHeader:{
        type:Boolean,
        default:true
      },
      tBorder:{
          type:Boolean,
          default:true
      },
      fBorder:{
          type:Boolean,
          default:true
      },
      cBorder:{
          type:Boolean,
          default:true
      }
    },

  }
</script>

<style scoped>
  .title{
    height: 47px;
    line-height: 47px;
    padding-left:20px;
  }
  .title .close{
    float:right;
    margin-right:20px;
    margin-top: 2px;
    color:#C4392E;
    font-size:24px;
    cursor: pointer;
  }
  .search_form,
  .tableInfo{
    margin: 14px 17px;
    padding:0;
    box-sizing:border-box;
  }

  .border{
      border: 1px solid #eaedf1;
  }
  .box{
    height:100%;
  }
</style>
