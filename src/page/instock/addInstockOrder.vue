<template>
    <div  class="page">
      <div class="title">{{title}}入库订单
        <i class="el-icon-close close" @click="$router.go(-1)"></i>
      </div>
      <el-row style="margin-top: 20px;" :gutter="10">
          <el-col  :offset="2" :span="20">
            <el-form size="small " label-width="100px" :model="inStockMasterForm" ref="inStockMasterForm">
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-form-item label="入库订单号">
                  <el-input v-model="inStockMasterForm.inStockMasterNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-form-item label="客户单号">
                  <el-input v-model="inStockMasterForm.customerNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-form-item label="提货方式">
                  <el-select  placeholder="请选择" v-model="inStockMasterForm.inTruckType">
                      <el-option
                        v-for="item in inTruckTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-form-item label="订单级别">
                  <el-select  placeholder="请选择" v-model="inStockMasterForm.orderLevel">
                    <el-option
                      v-for="item in orderLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-form-item label="下单时间">
                  <el-date-picker
                    type="datetime"
                    placeholder="选择日期时间"
                    v-model="inStockMasterForm.orderTime">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-form-item label="计划入库时间">
                  <el-date-picker
                    type="datetime"
                    placeholder="选择日期时间"
                    v-model="inStockMasterForm.planTime">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
              <el-form-item label="供货商单位">
                <el-select  placeholder="请选择" v-model="inStockMasterForm.supplierId">
                  <el-option
                    v-for="item in supplierOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-form-item label="联系人">
                  <el-input v-model="inStockMasterForm.contactName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-form-item label="联系方式">
                  <el-input placeholder="联系方式" v-model="inStockMasterForm.contactPhone1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12">
                <el-form-item label="联系地址">
                  <el-input placeholder="联系地址" v-model="inStockMasterForm.contactAdress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-form-item label="备注">
                  <el-input type="textarea" placeholder="备注" v-model="inStockMasterForm.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col  :offset="2">
          <el-form :inline="true" size="small " label-width="80px">
              <el-form-item>
                <el-select
                  size="small"
                  v-model="optionValue"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入商品名称"
                  :remote-method="remoteMethod"
                  :loading="loading">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="货品编号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select  placeholder="货品状态" v-model="optionValue">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="数量"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select  placeholder="单位" v-model="optionValue">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">
                  添加
                </el-button>
              </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
          <el-col :offset="2" :span="20">
            <el-table tooltip-effect="light" stripe size="small">
              <el-table-column type="selection" width="60"></el-table-column>
              <el-table-column prop="status" label="货品名称" ></el-table-column>
              <el-table-column prop="userName" label="货品编号" ></el-table-column>
              <el-table-column prop="mobile" label="货品状态" ></el-table-column>
              <el-table-column prop="email" label="货品数量"></el-table-column>
              <el-table-column prop="email" label="单位"></el-table-column>
              <el-table-column prop="email" label="入库时间"></el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <el-context-menu :menus="[]" :scope="scope"></el-context-menu>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="20" style="text-align: center; padding:10px;">
          <el-button size="small">关闭</el-button>
          <el-button type="primary" size="small">保存</el-button>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
        name: "add-instock-order",
        data(){
          return {
              inStockMasterForm:{
                inStockMasterNo:'',
                customerNo:'',
                inTruckType:'',
                orderLevel:'',
                orderTime:'',
                planTime:'',
                supplierId:'',
                contactName:'',
                contactPhone1:'',
                contactAdress:'',
                remark:''
            },
            inTruckTypeOptions:[{
              value: '1',
              label: '客户自送'
            },{
              value: '2',
              label: '大地提货'
            }],
            orderLevelOptions:[{
              value: '1',
              label: '普通'
            },{
              value: '2',
              label: '紧急'
            }],
            supplierOptions: [{
              value: '1',
              label: '大地'
            }, {
              value: '2',
              label: '艾控'
            }],
            loading:false,
            options:[],
            optionValue:'',
            list:[
              {
                label:'娃哈哈',
                value:2
              },
              {
                label:'小样',
                value:1
              }
            ]
          }
        },
        computed:{
          title(){
            var oper = this.$route.query.oper;
            return oper == 'add'?'新增':oper=='modify'?'修改':''
          }
        },
        methods:{
          remoteMethod(query) {
            if (query !== '') {
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                this.options = this.list.filter(item => {
                  return item.label
                    .indexOf(query) > -1;
                });
              }, 200);
            } else {
              this.options = [];
            }
          }
        }
    }
</script>

<style scoped>

</style>
