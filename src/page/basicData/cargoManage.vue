<template>
  <base-layout>
    <template slot="header">
      <span>商品资料</span>
    </template>
    <template slot="form_content">
      <el-form ref="form" label-width="90px" size="small">
        <div class="searchHeader">
          <span>查询条件</span>
          <div class="btns">
            <el-button type="primary" icon="el-icon-search" size="small" plain @click="query()">查询</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" plain @click="resetForm('form');query();">重置</el-button>
          </div>
        </div>
        <div class="searchBox">
          <el-row class="searchBar">
            <el-col :span="6">
              <el-form-item label="商品编码:" prop='cargoCode'>
                <el-input v-model="form.cargoMap.cargoCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品名称:" prop='cargoName'>
                <el-input v-model="form.cargoMap.cargoName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态:" prop='cargoStatus'>
                <el-select v-model="form.cargoMap.cargoStatus" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in options"
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
    </template>
    <template slot="table_content">
      <div class="table">
        <div class="table-header">
          <span class="title">查询结果</span>
          <div class="btn-group">
            <el-button icon="el-icon-plus" size="small" plain @click="addNew">新增</el-button>
            <el-button icon="el-icon-upload2" size="small" plain >
              <span @click="importDialogVisible=true">导入</span>
            </el-button>
          </div>
        </div>

        <el-table tooltip-effect="light" stripe class="el-table-custom" :data="tableData" size="small">
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column prop="cargoCode" label="商品编号"></el-table-column>
          <el-table-column prop="cargoName" label="商品名称"></el-table-column>
          <el-table-column prop="anotherName" label="别称"></el-table-column>
          <el-table-column prop="cargoStatus" label="状态"></el-table-column>
          <el-table-column prop="isEnable" label="启用状态"></el-table-column>
          <el-table-column prop="barCode" label="商品条码"></el-table-column>
          <el-table-column prop="uom" label="库存单位"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-context-menu :menus="menus" :scope="scope" :default="2"  @oper="handleMenuOper"></el-context-menu>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="paginationParams.currentPage"
          :page-size="pagination.size"
          layout="total,prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
        <!--新增、修改、查看-->
        <el-dialog :visible.sync="dialogVisible" width="60%">
          <div class="dialogHeader">
            <span v-show="operation==='add'">新增</span>
            <span v-show="operation==='modify'">修改</span>
            <span v-show="operation==='view'">查看</span>
          </div>
          <el-form :model="dialogForm" label-width="120px" ref="dialogForm" size="mini">
            <el-row>
              <el-col :span="12">
                <el-form-item label="商品编码：" prop="cargoCode" :rules="[ { required: true, message: '商品编码不能为空'}]">
                  <el-input v-model="dialogForm.cargoCode" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品名称：" prop="cargoName" :rules="[ { required: true, message: '商品名称不能为空'}]">
                  <el-input v-model="dialogForm.cargoName" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品条码：" prop="barCode" :rules="[{}]">
                  <el-input v-model="dialogForm.barCode" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="库存单位：" prop="uom" :rules="[{ required: true, message: '库存单位不能为空'}]">
                  <el-input v-model="dialogForm.uom" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="箱系数：" prop="boxFactor"
                              :rules="[{required:true,message:'箱系数不能为空'}, {pattern:/^\+?[1-9][0-9]*$/, message: '请输入正确的箱系数'} ]">
                  <el-input v-model="dialogForm.boxFactor" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品规格：" prop="cargoSpec">
                  <el-input v-model="dialogForm.cargoSpec" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="长(m)：" prop="longness"
                              :rules="[{pattern:/^\d+(\.{0,1}\d+){0,1}$/, message: '请输入正确的长度'}]">
                  <el-input v-model="dialogForm.longness" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="宽(m)：" prop="wide"
                              :rules="[{pattern:/^\d+(\.{0,1}\d+){0,1}$/, message: '请输入正确的箱系数'}]">
                  <el-input v-model="dialogForm.wide" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="高(m)：" prop="high"
                              :rules="[{pattern:/^\d+(\.{0,1}\d+){0,1}$/, message: '请输入正确的箱系数'}]">
                  <el-input v-model="dialogForm.high" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体积(㎡)：" prop="unitCbm"
                              :rules="[{pattern:/^\d+(\.{0,1}\d+){0,1}$/, message: '请输入正确的箱系数'}]">
                  <el-input v-model="dialogForm.unitCbm" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="毛量(kg)：" prop="unitGrossWeight"
                              :rules="[{pattern:/^\d+(\.{0,1}\d+){0,1}$/, message: '请输入正确的箱系数'}]">
                  <el-input v-model="dialogForm.unitGrossWeight" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="净重(kg)：" prop="unitNetWeight">
                  <el-input v-model="dialogForm.unitNetWeight" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="箱条码：" prop="boxBarCode">
                  <el-input v-model="dialogForm.boxBarCode" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="箱单位：" prop="boxUom">
                  <el-input v-model="dialogForm.boxUom" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="品牌：" prop="cargoBrand">
                  <el-input v-model="dialogForm.cargoBrand" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="尺寸：" prop="cargoSize">
                  <el-input v-model="dialogForm.cargoSize" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="颜色：" prop="cargoColour">
                  <el-input v-model="dialogForm.cargoColour" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="适合车型：" prop="cargoModel">
                  <el-input v-model="dialogForm.cargoModel" :disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
         <template>
          <el-button @click="dialogVisible =false" size="small">关闭</el-button>
          <el-button type="primary" icon="circle-check" v-show="operation==='add' "
                     size="small" @click="addNewSubmit">提交</el-button>
          <el-button type="primary" icon="circle-check" v-show="operation==='modify' "
                     size="small" @click="modifySubmit">提交</el-button>
         </template>
      </span>
        </el-dialog>

        <!--导入弹窗-->
        <el-dialog :visible.sync="importDialogVisible" @close="closedialog">
          <div class="dialogHeader">
            <span>导入</span>
          </div>
          <el-form :model="updateParams" :rules="updateRules" ref="updateForm">
            <el-form-item label="上传文件：" prop="file">
              <el-upload ref="upload" action="" :auto-upload="false" accept=".xlsx" :on-change="uploadChange">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <p class="downloadTemplate">
            <span @click="downTemplate">下载导入文件模板</span>
          </p>
          <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">关闭</el-button>
        <b class="importLoading" v-loading="importLoading">
          <el-button type="primary" @click="uploadFileHandle">提交</el-button>
        </b>
      </span>
        </el-dialog>
      </div>
    </template>
  </base-layout>
</template>

<script>
  import  axios from 'axios'
  export default {
    data() {
      return {
        operation: '',
        dialogVisible: false,
        importDialogVisible: false,
        disabled: false,
        tableData: [],
        batchRows:[],//存取表格批量或单选中行
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
        importLoading:false,
        updateForm: {},
        paginationParams: {
          currentPage: 1
        },
        pagination: {
          current: 1,
          size: 10,
          total: 0
        },
        form: {
          cargoMap: {
            cargoCode: '',
            cargoName: '',
            cargoStatus: '',
            isEnabled: 1
          }
        },
        dialogForm: {
          cargoId: null,
          cargoCode: null,
          cargoName: null,
          barCode: null,
          uom: null,
          cargoSpec: null,
          boxFactor: 1,
          longness: 0,
          wide: 0,
          high: 0,
          unitCbm: 0,
          boxBarCode: null,
          boxUom: null,
          unitGrossWeight: 0,
          unitNetWeight: 0,
          cargoBrand: null,
          cargoSize: null,
          cargoColour: null,
          cargoModel: null
        },
        updateParams: {
          "file": null
        },
        updateRules: {
          file: [
            { validator: this.validateFile }
          ]
        },
        options: [{
          value: '0',
          label: '初始'
        }, {
          value: '4',
          label: '已审核'
        }]
      }
    },
    mounted(){
      this.query()
    },
    computed: {},
    methods: {
      resetForm:function(name){
        this.$refs[name].resetFields();
      },
      handleMenuOper(command, scope) { //点击上下菜单
        if(command === 'look'){
          this.disabled = true;
          this.operation = 'view'
          this.dialogVisible = true;
          this.cargoQueryById(scope.row.cargoId);
        } else if (command === 'del') {
          var arr = {ids:[]};
          arr.ids.push(scope.row.cargoId);
          this.deleteCargo(arr.ids);

        } else if (command === 'edit') {
          this.operation = 'modify'
          this.disabled = false;
          this.dialogVisible = true;
          this.cargoQueryById(scope.row.cargoId);
        }
      },
      query: function () {
        var params = {
          cargoMap: null,
          page: null
        }
        params.cargoMap = this.form.cargoMap;
        console.log(params.cargoMap)
        params.page = this.pagination;
        var url = "data/cargo/query"
        this.$fetch.doPost(url, params, true).then((rep) => {
          this.tableData = rep.data.list;
          this.pagination.total = rep.data.page.total;
        }, (error) => {
          this.$message.error(error);
        })
      },
      handleSizeChange: function (pageSize) {
        this.pagination.size = pageSize;
        this.query()
      },
      //currentPage 改变时会触发
      handleCurrentChange: function (currentPage) {
        this.pagination.current = currentPage
        this.query()
      },
      addNew: function () {
        this.operation = 'add';
        this.dialogVisible = true;
      },
      //新增提交
      addNewSubmit() {
        this.$refs["dialogForm"].validate((valid) => {
          if (valid) {
            var params = {}
            params = JSON.parse(JSON.stringify(this.dialogForm));
            console.log(params)
            var url = "data/cargo/add"
            this.$fetch.doPost(url, params).then((resp) => {
              if (resp.returnCode == "1") {
                this.$message({
                  message: resp.returnMsg,
                  type: 'success'
                });
                this.dialogVisible = false;
                this.query();
                //this.$store.dispatch("userQuery");
              } else {
                this.$message({
                  message: "新增失败, " + resp.returnMsg,
                  type: 'error'
                });
              }
            }, (error) => {
              this.$message.error(error);
            })
          } else {
            return false;
          }
        });
      },
      modifySubmit() {
        this.$refs["dialogForm"].validate((valid) => {
          if (valid) {
            var params = {

            }
            params = JSON.parse(JSON.stringify(this.dialogForm));

            var url="data/cargo/update"
            this.$fetch.doPost(url,params).then((resp) => {
              if (resp.returnCode == "1") {
                this.$message({
                  message: resp.returnMsg,
                  type: 'success'
                });
                this.dialogVisible = false;
                this.query();
              } else {
                this.$message({
                  message: "修改失败, " + resp.returnMsg,
                  type: 'error'
                });
              }
            }, (error) => {
              this.$message.error(error);
            })
          } else {
            return false;
          }
        });
      },
      closedialog: function () {
        this.$refs.upload.clearFiles();
        this.$refs.updateForm.resetFields();
      },
      validateFile: function (rule, value, callback) {
        if (!this.$refs.upload.uploadFiles.length) {
          callback(new Error('请选择要上传的文件'));
          // } else if (this.$refs.upload.uploadFiles.length > 1) {
          //   callback(new Error('每次上传只支持一个文件'));
        } else {
          var regx = new RegExp("(.xlsx)$");
          if (!regx.test(this.$refs.upload.uploadFiles[0].name)) {
            callback(new Error('文件格式只支持xlsx'));
          }
          callback();
        }
      },
      uploadChange:function(file,filelist){
        if(filelist.length>1){
          filelist.splice(0,1);
        }
        this.$refs.upload.$el.children[0].children[1].value = "";
      },
      downTemplate: function () {
        this.$message.info('正在生成导入模版,请稍等');
        let url = 'data/cargo/exportEmptyCargoFile'
        this.$fetch.doGet(url).then((rep) => {
          if (rep.returnCode === 0) {

          }
        }, (error) => {
          this.$message.error(error);
        })
      },
      uploadFileHandle: function () {
        this.$refs["updateForm"].validate((valid) => {
          if (valid) {
            var formData = new FormData();
            let url = 'data/cargo/uploadCargoFile'
            formData.append("file", this.$refs.upload.uploadFiles[0].raw)
            this.importLoading=true;''
            axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
            axios.post(url,'',formData).then((rsp)=>{
              if (rsp.returnCode == 0) {
                this.dialogVisible = false;
                this.query();
              }
              this.importLoading=false;
            },(error)=>{
              this.importLoading=false;
              this.$message.error(error);
            })
            // this.$fetch.doPost(url,'',formData).then((rsp) => {
            //   if (rsp.returnCode == 0) {
            //     this.dialogVisible = false;
            //     this.query();
            //   }
            //   this.importLoading=false;
            // }, (error) => {
            //   this.importLoading=false;
            //   this.$message.error(error);
            // })
          } else {
            return false;
          }
        })
      },
      deleteCargo(ids) {
        var params = {ids:[]};
        params.ids = ids;
        var url="data/cargo/delete"
        this.$fetch.doPost(url,params,true).then((resp) => {
          if (resp.returnCode == "1") {
            this.$message({
              message: resp.returnMsg,
              type: 'success'
            });
            this.batchRows = [];
            this.query();
          } else {
            this.$message({
              message: "删除失败, " + resp.returnMsg,
              type: 'error'
            });
          }
        }, (error) => {
          this.$message({
            message: "删除失败, " + error,
            type: 'error'
          });
        })
      },
      //查看单条数据
      cargoQueryById:function(id){
        var url="data/cargo/query"
        this.$fetch.doGet(url,id).then((resp) => {
          if (resp.returnCode == "1") {
            this.dialogForm=resp.data;
            console.log(resp.data)
          } else {
            this.$message.error(resp.returnMsg);
          }
        }, (error) => {
          this.$message.error(error);
        })
      },
    }
  }
</script>

<style scoped>
  .importLoading{
    display: inline-block
  }
</style>
