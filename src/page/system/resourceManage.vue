<template>
  <div>
    <base-layout>
      <div slot="header" >
        <span>资源管理</span>
      </div>
      <div slot="form_content">
        <el-form ref="form" label-width="90px" size="small" :model="form">
          <div  class="searchHeader">
            <span>查询条件</span>
            <div class="btns">
              <!--<el-button icon="el-icon-arrow-down" v-collapse:collapseVisible size="small">展开</el-button>-->
              <el-button type="primary" icon="el-icon-search" size="small" @click="query">查询</el-button>
              <el-button icon="el-icon-refresh" size="small" @click="resetForm('form');query();">重置</el-button>
            </div>
          </div>
          <div class="searchBox">
            <el-row class="searchBar">
              <el-col :span="6">
                <el-form-item label="资源编码:" prop='resourceCode'>
                  <el-input v-model="form.resourceCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="资源名称:" prop='resourceName'>
                  <el-input v-model = "form.resourceName" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="资源类型:" prop='resourceType'>
                  <el-select v-model="form.resourceType"  placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in statics" :key="item.key" :label="item.value" :value="item.key"></el-option>
                  </el-select>
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
                <el-button icon="el-icon-plus" size="small"  plain @click="addResource">新增</el-button>
                <el-button icon="el-icon-delete" size="small"  plain @click="batchDeleteResource">删除</el-button>
              </div>
            </div>
          <el-table class="el-table-custom" :data="tableData"  @select-all="doSelectAllHandle" tooltip-effect="light" @select="doSelectHandle" stripe  size="small">
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column prop="resourceCode" label="资源编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="resourceName" label="资源名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parentResName" label="父资源" show-overflow-tooltip></el-table-column>
            <el-table-column prop="resourceAttr" label="资源属性" show-overflow-tooltip></el-table-column>
            <el-table-column prop="resourceType" label="类型" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.resourceType | translate(statics)}}
              </template>
            </el-table-column>

            <el-table-column prop="resourceOrder" label="优先级" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>

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
    <el-dialog :visible.sync="addnewDialog" @close="resetDialogForm">
      <div class="dialogHeader"><span v-if="type==1">新增</span><span v-if="type==2">修改</span></div>
      <el-form label-width="120px" :model="dialogForm" ref="dialogForm" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="资源编码：" prop="resourceCode" :rules="[ { required: true, message: '资源编码不能为空'}]">
              <el-input v-model="dialogForm.resourceCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资源名称：" prop="resourceName" :rules="[ { required: true, message: '资源名称不能为空'}]">
              <el-input v-model="dialogForm.resourceName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型：" prop="resourceType" :rules="[ { required: true, message: '请选择菜单类型'}]">
              <el-select v-model="dialogForm.resourceType" placeholder="请选择" style="width:100%;">
                <el-option v-for="item in statics" :key="item.key" :label="item.value" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="父资源：" prop="parentResId"  :rules="[ { required: true, message: '请选择父节点'}]">
              <el-cascader :options="allMenu" :show-all-levels="false" :props='propsDefault' v-model="dialogForm.parentResId" :change-on-select="true" style="width:100%" @change="parentResIdChange"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="优先级：" prop="resourceOrder" :rules="[ { required: true, message: '请填写优先级'}]">
              <el-input type="number" min="0"  v-model="dialogForm.resourceOrder"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资源属性：" prop="resourceAttr" :rules="[ { required: true, message: '请输入资源属性'}]">
              <el-input v-model="dialogForm.resourceAttr"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>


    <span slot="footer" class="dialog-footer">
         <el-button @click="resetDialogForm">重置</el-button>
         <el-button type="primary" @click="submitDialogForm" v-show="type==1">提交</el-button>
         <el-button type="primary" @click="modifyResourceInfo" v-show="type==2">修改</el-button>
       </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        form: {
          resourceCode: '',
          resourceName: '',
          resourceType: ''
        },
        pagination: {
          current: 1,
          size: 10,
          total: 0
        },
        dialogForm: {
          resourceId: null,
          resourceCode: null, // 资源编码
          resourceName: null, //资源名称
          resourceType: null, //资源类型
          resourceOrder: null, // 优先级
          parentResId: null, // 父资源Id
          resourceAttr: null, //资源属性
        },
        tableData: [],
        statics: [{
          key: "1",
          value: '菜单'
        }, {
          key: "2",
          value: '按钮'
        }, {
          key: "3",
          value: '组件'
        }],
        statusList: [{
          key: 0,
          value: '无效'
        }, {
          key: 1,
          value: '有效'
        }],
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
        type: 1, // 1 新增 2 修改 控制对话框的按钮
        propsDefault: {
          label: 'DATA_NAME',
          value: 'DATA_ID',
          children: "children"
        },
        batchRows: [], //存取表格批量或单选中行
        resourceType: [], //资源类型
        allMenu: []
      }
    },
    methods: {
      parentResIdChange:function(value){
        //this.dialogForm.parentResId=value[0];
      },
      clickRow(command, scope) { //点击上下菜单
        if (command === 'del') {
          var arr = [];
          arr.push(scope.row.resourceId);
          this.$confirm('确认删除该资源？').then(() => {
            this.deleteResource(arr)
        }).catch(() => {});

        } else if (command === 'edit') {
          this.type = 2;
          this.querySingleResource(scope.row);
        }
      },
      resetForm() {
        this.$refs.form.resetFields();
        this.query();
      },
      query() { //多条件查询
        var params = {
          resourceMap: null,
          page: null
        }
        params.resourceMap = this.form;
        params.page = this.pagination;
        var url='/system/resource/query'
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
            var params = {
              resource: null
            }
            params.resource = JSON.parse(JSON.stringify(this.dialogForm));
            params.resource.parentResId = params.resource.parentResId.splice(-1)[0]
            var url='/system/resource/add'
            this.$fetch.doPost(url,params).then((resp) => {
            if (resp.returnCode == "1") {
              this.$message({
                message: resp.returnMsg,
                type: 'success'
              });
              this.addnewDialog = false;
              this.query();
              this.queryAllowMenu();
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
      resetDialogForm() { //重置表单
        this.dialogForm = {
          resourceId: null,
          resourceCode: null, // 资源编码
          resourceName: null, //资源名称
          resourceType: null, //资源类型
          resourceOrder: null, // 优先级
          parentResId: [], // 父资源Id
          resourceAttr: null, //资源属性
        };
        this.$refs.dialogForm.resetFields();
      },
      addResource() { //新增处理函数
        this.addnewDialog = true;
        this.type = 1;
      },
      modifyResourceInfo() { //修改资源信息
        var isVlid = false;
        this.$refs["dialogForm"].validate((valid) => {
          if (valid) {
            isVlid = true;
            var params = {},
              temp = null;
            params.resource = this.dialogForm;
            temp = params.resource.parentResId;
            params.resource.parentResId = temp.splice && temp.length ? temp.splice(-1)[0] : temp
            var url='/system/resource/update'
            this.$fetch.doPost(url,params).then((resp) => {
              if (resp.returnCode == "1") {
              this.$message({
                message: resp.returnMsg,
                type: 'success'
              });
              this.addnewDialog = false;
              this.query();
              this.queryAllowMenu();
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
      querySingleResource(e) { //修改时，查找完整的资源信息
        var params = e.resourceId || 0;
        var url='/system/resource/query'
        this.$fetch.doGet(url,params).then((resp) => {
          var keys = [],
          form = this.dialogForm,
          oResource = resp.data;
        if (resp.returnCode == "1") {
          keys = Object.keys(this.dialogForm);
          for (let key of keys) {
            form[key] = oResource[key]
          }
          form.parentResId = this.$util.getCascaderSelectIds(this.allMenu, form.parentResId, 'DATA_ID', 'children');
          this.addnewDialog = true;
        } else {
          this.$message({
            message: "Error Info " + resp.returnMsg,
            type: 'error'
          });
        }
      }, (error) => {
          this.$message.error(error);
        })
      },
      doPaging(currentPage) { //分页处理
        this.pagination.current = currentPage;
        this.query();
      },
      /*
       *单选用户和批量删除
       */
      deleteResource(ids) {
        var params = {};
        params.resourceIds = ids;
        var url='/system/resource/delete'
        this.$fetch.doPost(url,params).then((resp) => {
        if (resp.returnCode == "1") {
          this.$message({
            message: resp.returnMsg,
            type: 'success'
          });
          this.addnewDialog = false;
          this.query();
          this.queryAllowMenu();
        } else {
          this.$message({
            message: "删除失败, " + resp.returnMsg,
            type: 'error'
          });
        }
      }, (error) => {
          this.$message.error(error);
        })
      },
      batchDeleteResource() {
        var ids = this.batchRows.map(function(item) {
          return item.resourceId
        })
        this.operBefore('删除',ids).then(()=>{
          this.deleteResource(ids);
        }).catch(()=>{

        });
      },
      /*处理表格全选和单选按钮*/
      doSelectAllHandle(selection) {
        this.batchRows = selection;
      },
      doSelectHandle(selection, row) {
        this.batchRows = selection;
      },
      queryAllowMenu() {
        var url='system/resource/query/tree/allMenu';
        this.$fetch.doGet(url).then((resp) => {
         var arr = [];
        if (resp.returnCode == 1) {
          arr.push(resp.data)
          this.allMenu = arr;
        } else {
          this.$message({
            message: "查找菜单树失败, " + error,
            type: 'error'
          });
        }
      }, (error) => {

        })
      }
    },
    computed: {},
    created() {
      this.query();
      this.queryAllowMenu();

    }
  }
</script>
