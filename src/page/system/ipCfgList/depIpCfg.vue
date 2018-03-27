<template>
  <div>
    <base-layout :showHeader="false">
      <div slot="form_content">
        <el-form ref="form" label-width="90px" size="small" :model="form">
          <div  class="searchHeader">
            <span>查询条件</span>
            <div class="btns">
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
              <el-button icon="el-icon-refresh" size="small" @click="resetForm('form');query();">重置</el-button>
            </div>
          </div>
          <div class="searchBox">
            <el-row class="searchBar">
              <el-col :span="6">
                <el-form-item label="部门:" prop='departId'>
                  <el-cascader :options="departTree" :props="defaultprops"  v-model="form.departId" :show-all-levels="false" :change-on-select="true">
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="IP:" prop='ip'>
                  <el-input v-model="form.ip"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div slot="table_content">
        <div class="table">
          <div class="table-header">
            <span class="title">查询结果</span>
            <div class="btn-group">
              <el-button icon="el-icon-plus" size="small"  plain @click="batchOper(1)">新增</el-button>
              <!--<el-button icon="el-icon-edit" size="small"  plain @click="batchOper(2)">修改</el-button>-->
              <el-button icon="el-icon-delete" size="small"  plain @click="batchDelete">删除</el-button>
            </div>
          </div>
          <el-table class="el-table-custom" :data="tableData"  @select-all="doSelectAllHandle" tooltip-effect="light" @select="doSelectHandle" stripe  size="small">
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column prop="departName" label="部门" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip" label="IP地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-context-menu :menus="menus" :scope="scope" @oper="clickRow"></el-context-menu>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination layout="total, prev, pager, next,jumper" :total="pagination.total" @current-change="doPaging" :current="pagination.current" :page-size="pagination.size"></el-pagination>
        </div>
      </div>
    </base-layout>
    <el-dialog :visible.sync="addnewDialog" @close="resetDLForm">
      <div class="dialogHeader"><span v-if="type==1">新增</span><span v-if="type==2">修改</span></div>
      <el-form label-width="120px" :model="dialogForm" ref="dialogForm" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="部门：" prop="ids" :rules="[ { required: true, message: '部门不能为空'}]">
              <el-cascader :options="departTree" :props="defaultprops" :disabled="disabledTag"  v-model="dialogForm.ids" :show-all-levels="false" :change-on-select="true" style="width: 100%">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="限制IP：" prop="ips" :rules="[{validator:validIp,trigger:'blur'}]" class="is-required">
              <el-input v-model="dialogForm.ips" placeholder="多个IP之间用英文,隔开" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    <span slot="footer" class="dialog-footer">
         <el-button @click="addnewDialog=false">关闭</el-button>
         <el-button type="primary" @click="submitDialogForm" v-show="type==1">提交</el-button>
         <el-button type="primary" @click="modifyDialogForm" v-show="type==2">修改</el-button>
       </span>
    </el-dialog>
  </div>
</template>
<script>
  import BaseLayout from '../../../components/layout/base'
  import Mixins from '../../../mixins/form'
  export default {
    mixins:[Mixins],
    data() {
      return {
        form: {
          departId:[],
          ip:null
        },
        pagination: {
          current: 1,
          size: 10,
          total: 0
        },
        dialogForm: {
          "ids": null,
          "ips": null
        },
        tableData: [],
        menus: [{
          text: "修改",
          command: "edit",
          //ruleCode: 'resourceManage_update'
        }, {
          text: "删除",
          command: "del",
          //ruleCode: 'resourceManage_del'
        }],
        addnewDialog: false,
        multipleTag:false,
        disabledTag:false,
        defaultprops: {
          value: "dataId",
          label: "label",
          children: "children"
        },
        type: 1, // 1 新增 2 修改 控制对话框的按钮
        batchRows: [], //存取表格批量或单选中行
        //userList:[]
      }
    },
    components: {
      BaseLayout
    },
    methods: {
      clickRow(command, scope) { //点击上下菜单
        if (command === 'del') {
          var arr = [];
          arr.push(scope.row.departId);
          this.$confirm('确认删除该数据？').then(() => {
            this.deleteIp(arr)
        }).catch(() => {});

        } else if (command === 'edit') {
          this.fillBack(scope.row)
        }
      },
      fillBack:function(row){
        this.batchOper(2);
        this.dialogForm.ids = this.$util.getCascaderSelectIds(this.departTree,row.departId,'dataId','children');
        this.dialogForm.ips=row.ip.replace(/\s+/g,'');//去除空格
      },
      query() { //多条件查询
        var params = {
          departIpLoginMap: null,
          page: null
        }
        params.departIpLoginMap = JSON.parse(JSON.stringify(this.form));
        params.page = this.pagination;
        if(params.departIpLoginMap.departId.length){
          params.departIpLoginMap.departId=params.departIpLoginMap.departId.splice(-1)[0];
        }else{
          params.departIpLoginMap.departId=null;
        }

        var url='system/departIpLogin/query'
        this.$fetch.doPost(url,params,true).then((rep) => {
          var page = rep.data.page;
        this.tableData = rep.data.list;
        this.pagination.total = page.total;
      }, (error) => {
          this.$message.error(error);
        })
      },
      submitDialogForm() { //新增提交
        this.$refs["dialogForm"].validate((valid) => {
          if (valid) {
            var url='system/departIpLogin/add'
            var params = {}
            params.ids = [this.dialogForm.ids[this.dialogForm.ids.length-1]]
            params.ips = this.dialogForm.ips.split(',');
            this.$fetch.doPost(url,params).then((resp) => {
              if (resp.returnCode == "1") {
              this.$message({
                message: resp.returnMsg,
                type: 'success'
              });
              this.addnewDialog = false;
              this.query();
            } else {
              this.$message.error("新增失败, " + resp.returnMsg);
            }
          }, (error) => {
              this.$message.error(error);
            })
          } else {
            return false;
          }
        });
      },
      batchOper(type) { //批量处理函数
        this.type = type;
        this.addnewDialog = true;
        if(type==2){
          this.disabledTag=true;
        }else if(type==1){
          this.disabledTag=false;
        }
      },
      modifyDialogForm() { //修改
        this.$refs["dialogForm"].validate((valid) => {
          if (valid) {
            var url='system/departIpLogin/update'
            var params = {}
            params.ids = [this.dialogForm.ids[this.dialogForm.ids.length-1]]
            params.ips = this.dialogForm.ips.split(',');
            this.$fetch.doPost(url,params).then((resp) => {
              if (resp.returnCode == "1") {
              this.$message({
                message: resp.returnMsg,
                type: 'success'
              });
              this.addnewDialog = false;
              this.query();
            } else {
              this.$message.error("修改失败, " + resp.returnMsg);
            }
          }, (error) => {
              this.$message.error(error);
            })
          } else {
            return false;
          }
        });
      },
      /*
       *单选用户和批量删除
       */
      deleteIp(ids) {
        var url='system/departIpLogin/delete';
        var params = {};
        params.ids = ids;
        this.$fetch.doPost(url,params).then((resp) => {
          if (resp.returnCode == "1") {
          this.$message({
            message: resp.returnMsg,
            type: 'success'
          });
          this.addnewDialog = false;
          this.query();
        } else {
          this.$message.error("删除失败, " + resp.returnMsg);
        }
      }, (error) => {
          this.$message.error(error);
        })
      },
      batchDelete() {
        var ids = this.batchRows.map(function(item) {
          return item.departId
        })
        if(ids.length){
          this.operBefore('删除',ids).then(()=>{
            this.deleteIp(ids);
        }).catch(()=>{

          });
        }else{
          this.$message.warning("请选择要删除的部门");
        }
      },
      resetDLForm:function(){
        this.$refs['dialogForm'].resetFields();
        this.dialogForm.ids=[];
        this.dialogForm.ips=null;
      },
      //ip校验
      validIp:function (rule, value, callback) {
        if (value) {
          let str=/^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/
          let val=value.split(','),
            flag = false;
          if(val.length>1){
            for(let i in val){
              if(str.test(val[i])){

              }else{
                flag = true;
                break;
              }
            }
            if(flag) callback(new Error('请输入正确的IP,多个IP之间用英文,隔开'));
            else callback();
          }else{
            if(str.test(value)){
              callback()
            }else{
              callback(new Error('请输入正确的IP'));
            }
          }
        } else {
          callback(new Error('IP不能为空'));
        }
      },
      /*处理表格全选和单选按钮*/
      doSelectAllHandle(selection) {
        this.batchRows = selection;
      },
      doSelectHandle(selection, row) {
        this.batchRows = selection;
      },
      doPaging(currentPage) { //分页处理
        this.pagination.current = currentPage;
        this.query();
      }
    },
    computed: {
      departTree: function () {
        return this.$store.getters.departTree
      },
    },
    created() {
      this.query();
    }
  }
</script>
