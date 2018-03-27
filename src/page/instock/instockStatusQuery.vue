<template>
  <base-layout>
    <template slot="header">
      入库状态查询
    </template>
    <el-form ref="form" label-width="120px" size="small" slot="form_content" :model="form.inTrackMap">
      <div  class="searchHeader">
        <span>查询条件</span>
        <div class="btns">
          <el-button type="primary"  icon="el-icon-search"   size="small" @click="query"  plain>查询</el-button>
          <el-button type="danger"   icon="el-icon-delete"   size="small" @click="resetForm('form');query();" plain>清空</el-button>
        </div>
      </div>
      <div class="searchBox">
        <el-row class="searchBar">
          <el-col :span="6">
            <el-form-item label="供货商:" prop='supplierName'>
              <el-input v-model="form.inTrackMap.supplierName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库订单号:" prop='inStockMasterNo'>
              <el-input v-model="form.inTrackMap.inStockMasterNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="searchBar">
          <el-col :span="12">
            <el-form-item label="下单时间:" prop='orderTime'>
              <el-date-picker
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="form.inTrackMap.orderTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划入库时间:" prop='planTime' label-width="120px">
              <el-date-picker
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" v-model="form.inTrackMap.planTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="table" slot="table_content">
      <div class="table-header">
        <span class="title">订单查询结果</span>
        <div class="btn-group">
        </div>
      </div>

      <el-table tooltip-effect="light" stripe class="el-table-custom" :data="tableList" size="small">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="inStatus" label="订单状态" >
          <template slot-scope="scope">
            <i class="el-icon-info" style="color:#E6A23C;" v-if="scope.row.inStatus=='0'"></i>
            {{scope.row.inStatus|translate([{key:'0',value:'初始'},{key:'4',value:'已审核'}])}}
          </template>
        </el-table-column>
        <el-table-column prop="inStockMasterNo" label="入库订单号"></el-table-column>
        <el-table-column prop="supplierName" label="供货商"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="planTime" label="计划入库时间"></el-table-column>
        <el-table-column prop="suerTime" label="仓库接单"></el-table-column>
        <el-table-column prop="inTime" label="入园时间"></el-table-column>
        <el-table-column prop="receiveTime" label="收货完成"></el-table-column>
        <el-table-column prop="putTime" label="上架完成"></el-table-column>

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
  </base-layout>
</template>

<script>
  export default {
    name: "put-storage-status-query",
    data(){
      return {
        form:{
          inTrackMap:{
            supplierName:'',
            inStockMasterNo:'',
            orderTime:[],
            planTime:[],
          }
        },
        tableList:[],
        paginationParams:{
          currentPage:1
        },
        pagination: {
          current: 1,
          size: 10,
          total: 0
        },
      }
    },
    methods: {
      resetForm() {
        this.$refs.form.resetFields();
        this.query();
      },
      query:function() {
        var params = {
          inTrackMap: {
          },
          page:null
        }
        params.page = this.pagination;
        params.inTrackMap = JSON.parse(JSON.stringify(this.form.inTrackMap));
        this.$fetch.doPost("instock/inTrack/query/info",params,true).then((rep) => {
          if (rep.returnCode == "1") {
            this.tableList = rep.data.list;
            this.pagination.total = rep.data.page.total;
          }
        }, (error) => {
          this.$message.error(error);
        })
      },
      handleSizeChange:function(pageSize){
        this.pagination.size=pageSize;
        this.query();
      },
      //currentPage 改变时会触发
      handleCurrentChange:function(currentPage){
        this.pagination.current=currentPage
        this.query();
      },
    },
    mounted(){
    this.query();
   }
  }
</script>

<style scoped>

</style>

