<template>
  <base-layout>
    <template slot="header">
      入库订单
    </template>
    <el-form ref="form" label-width="90px" size="small" slot="form_content" :model="form.inStockMasterMap">
      <div  class="searchHeader">
        <span>状态查询条件</span>
        <div class="btns">
          <el-button type="primary"  icon="el-icon-search"   size="small" plain @click="handleSearch">查询</el-button>
          <el-button type="danger"   icon="el-icon-delete"   size="small"  plain @click="handleReset">清空</el-button>
        </div>
      </div>
      <div class="searchBox">
        <el-row class="searchBar">
          <el-col :xs="24" :sm="24" :md="6" :lg="6">
            <el-form-item label="入库订单号:" prop='inStockMasterNo'>
              <el-input  v-model="form.inStockMasterMap.inStockMasterNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6">
            <el-form-item label="供货商:" prop='supplierId'>
              <el-select v-model="form.inStockMasterMap.supplierId" clearable placeholder="请选择">
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6">
            <el-form-item label="客户单号:" prop='customerNo'>
              <el-input v-model="form.inStockMasterMap.customerNo"></el-input>
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
                v-model="form.inStockMasterMap.orderTime"
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
                end-placeholder="结束日期" v-model="form.inStockMasterMap.planTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="searchBar">
          <el-col :xs="24" :sm="24" :md="6" :lg="6">
            <el-form-item label="订单状态:" prop='inStatus'>
              <el-select v-model="form.inStockMasterMap.inStatus" clearable placeholder="请选择">
                <el-option
                  v-for="item in inStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6">
            <el-form-item label="提货方式:" prop='inTruckType'>
              <el-select v-model="form.inStockMasterMap.inTruckType" clearable placeholder="请选择">
                <el-option
                  v-for="item in inTruckTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="table" slot="table_content">
      <div class="table-header">
        <span class="title">订单查询结果</span>
        <div class="btn-group">
          <el-button type="primary" icon="el-icon-plus"     size="small" plain @click="handleAdd">新增</el-button>
          <el-button type="primary" icon="el-icon-document" size="small" plain @click="handleAudit">审核</el-button>
          <el-button type="primary" icon="el-icon-download" size="small" plain @click="handleExport">导出</el-button>
          <el-button type="primary" icon="el-icon-printer"    size="small" plain @click="handlePrint">打印</el-button>
          <el-button type="danger" icon="el-icon-delete"  size="small"  plain @click="handleDelete">批量删除</el-button>

        </div>
      </div>
      <el-table tooltip-effect="light" stripe  size="small" :data="tableList"  @select-all="handleTableSelected" @select="handleTableSelected">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="inStatus" label="订单状态" >
          <template slot-scope="scope">
            <i class="el-icon-info" style="color:#E6A23C;" v-if="scope.row.inStatus=='0'"></i>
            {{scope.row.inStatus|translate([{key:'0',value:'初始'},{key:'4',value:'审核'}])}}
          </template>
        </el-table-column>
        <el-table-column prop="inTruckType" label="提货方式" >
          <template slot-scope="scope">
            {{scope.row.inTruckType|translate([{key:'1',value:'客户自送'},{key:'2',value:'大地提货'}])}}
          </template>
        </el-table-column>
        <el-table-column prop="supplierCode" label="供货商编码" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierName" label="供货商单位"></el-table-column>
        <el-table-column prop="inStockMasterNo" label="入库订单号"></el-table-column>
        <el-table-column prop="customerNo" label="客户单号"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间"></el-table-column>
        <el-table-column prop="planTime" label="计划入库时间"></el-table-column>
        <el-table-column prop="contactName" label="联系人"></el-table-column>
        <el-table-column prop="contactPhone1" label="电话"></el-table-column>
        <el-table-column prop="contactAdress" label="联系地址"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-context-menu :menus="menus" :scope="scope" :default="2"  @oper="handleMenuOper"></el-context-menu>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pagination.size"
        :current-page = "pagination.current"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <transition name="el-fade-in">
      <router-view></router-view>
    </transition>
  </base-layout>
</template>

<script>
  import form from '../../mixins/form'
  export default {
    mixins:[form],
    name: "put-order",
    data(){
      return {
        form: {
          inStockMasterMap: {
            supplierId: '',
            inStockMasterNo: '',
            customerNo:'',
            orderTime: [],
            planTime: [],
            inStatus:'',
            inTruckType:''
          }
        },
        inStatusOptions:[{
        value: '0',
        label: '初始'
      },{
        value: '4',
        label: '已审核'
      }],
        inTruckTypeOptions:[{
          value: '1',
          label: '客户自送'
        },{
          value: '2',
          label: '大地提货'
        }],
        supplierOptions: [{
          value: '1',
          label: '大地'
        }, {
          value: '2',
          label: '艾控'
        }],
        menus: [
          {
            text: "查看",
            command: "look"
          },
          {
            text: "修改",
            command: "edit"
          },
          {
            text: "删除",
            command: "del"
          }
        ],
        tableList:[],
        pagination:{
          current: 1,
          size: 10,
          total: 0
        }
      }
    },
    methods:{
      query:function() {
        var params = {
          inStockMasterMap: {
          },
          page:null
        }
        params.page = this.pagination;
        params.inStockMasterMap = JSON.parse(JSON.stringify(this.form.inStockMasterMap));
        this.$fetch.doPost("instock/inStockMaster/query/info",params,true).then((rep) => {
          if (rep.returnCode == "1") {
            this.tableList = rep.data.list;
            this.pagination.total = rep.data.page.total;
          }
        }, (error) => {
          this.$message.error(error);
        })
      },
      handleSearch:function(){
        this.query();
      },
      handleReset:function(){
        this.$refs.form.resetFields();
        this.query();
      },
      handleAdd:function(){
        this.$router.push({
          path:'/main/instockOrder/addInStockOrder',
          query: {oper:'add'}
        })
      },
      handleAudit:function(){

      },
      handleExport:function(){

      },
      handlePrint:function(){

      },
      handleDelete:function(){

      },
      handleTableSelected:function(selection){
         this.$message.success(JSON.stringify(selection))
      },
      handleCurrentChange : function(currentPage){
        this.pagination.current = currentPage;
        this.query();
      },
      handleSizeChange(val) {
        var pagination = this.pagination;
        pagination.current = 1;
        pagination.size = val;
        this.query();
      },
      handleMenuOper(command, scope) { //点击上下菜单
        if(command === 'look'){
            this.$router.push({
                name:'instockOrderDetail'
            })
        } else if (command === 'del') {
            this.beforeOper('删除').then(()=>{
              this.$message.warning('点击删除');
            },()=>{
              this.$message.warning('点击取消')
            })
        } else if (command === 'edit') {
            this.$router.push({
              path:'/main/instockOrder/addInStockOrder',
              query: {oper:'modify'}
            })
        }
      }
    },
    computed:{
      begin(){
        var pagination = this.pagination;
        return (pagination.current - 1) * pagination.size;
      },
      end(){
        return this.begin + this.pagination.size;
      }
    },
    mounted(){
      var pagination = this.pagination;
      this.query();
    }
  }
</script>

<style scoped>

</style>
