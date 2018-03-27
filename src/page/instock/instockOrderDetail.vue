<template>
  <div  class="page">
    <div class="title">入库订单>查看
      <el-button type="primary" plain icon="el-icon-printer" size="mini"style="position: absolute;right:60px;top:10px;">打印</el-button>
      <i class="el-icon-close close" @click="$router.go(-1)"></i>
    </div>
    <el-row style="margin: 20px;">
      <el-col>
          <div class="panel panel-default">
              <div class="panel-header">
                  订单信息
              </div>
              <div class="panel-body clearfix">
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                      <label>货主:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>入库订单号:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>供货商单位:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>供货商编码:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>联系人:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>联系电话:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>总金额:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>订单状态:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>创建人:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>创建时间:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>修改人:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>修改时间:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>下单时间:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>要货时间:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>客户单号:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>配送方式:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>地址:</label>陈某某
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="6" :lg="6">
                    <label>备注:</label>陈某某
                  </el-col>
              </div>
          </div>
      </el-col>
      <el-col style="margin-top: 20px;">
          <div class="panel panel-default">
            <div class="panel-header">
              商品信息
            </div>
            <div class="panel-body clearfix no-padding">
              <el-table tooltip-effect="light" stripe  size="small" :data="[]">
                <el-table-column prop="inStatus" label="商品编码" >
                  <template slot-scope="scope">
                    <i class="el-icon-info" style="color:#E6A23C;" v-if="scope.row.inStatus=='0'"></i>
                    {{scope.row.inStatus|translate([{key:'0',value:'初始'},{key:'4',value:'审核'}])}}
                  </template>
                </el-table-column>
                <el-table-column prop="inTruckType" label="货品名称" >
                  <template slot-scope="scope">
                    {{scope.row.inTruckType|translate([{key:'1',value:'客户自送'},{key:'2',value:'大地提货'}])}}
                  </template>
                </el-table-column>
                <el-table-column prop="supplierCode" label="数量"></el-table-column>
                <el-table-column prop="supplierName" label="单价"></el-table-column>
                <el-table-column prop="inStockMasterNo" label="金额"></el-table-column>
                <el-table-column prop="customerNo" label="商品状态"></el-table-column>
                <el-table-column prop="customerNo" label="备注"></el-table-column>
              </el-table>
            </div>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "instock-order-detail"
  }
</script>

<style scoped>
  .page{
    background-color:#f6f6f6;
  }
  .panel{
    border:1px solid #ccc;
  }
  .panel-default{

  }
  .panel-default .panel-header{
    background-color: #f6f6f6;
  }
  .panel-header {
    padding: 10px 8px;
    text-align: left;
    border-bottom: 1px solid #d4d4d4;
  }
  .panel-body{
    padding:20px 8px;
    background-color: #fff;
  }
  .no-padding{
    padding:0;
  }
  .panel-body .el-col{
    padding:6px 0;
  }
  label{
    display: inline-block;
    width:100px;
    text-align: right;
  }
</style>
