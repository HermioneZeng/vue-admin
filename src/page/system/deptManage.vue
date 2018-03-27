<template>

  <base-layout :fBorder="false" :cBorder="false">
    <div slot="header" style="position: relative">
      <span>部门管理</span>
    </div>
    <template slot="table_content">
      <div class="form_con">
        <el-row>
          <el-col :span="4">
            <p class="tree_header">组织架构</p>
            <el-tree default-expand-all :data="departTree" accordion highlight-current @node-click="nodeClick" class="leftTree"></el-tree>
          </el-col>
          <el-col :span="20">
            <div class="main-right">
              <div class="title border-bottom">
                <span class="sub-title">  组织架构配置:</span>
                <el-button icon="el-icon-plus" size="small" type="info" plain @click="addnewClick">新增</el-button>
                <el-button icon="el-icon-delete" size="small" type="info" plain @click="deleClick">删除</el-button>
              </div>
            </div>

            <div class="form_box">
              <el-form :model="form.depart" :rules="rules" ref="addnewForm" label-width="100px" :label-position="labelPosition" v-show="detailvisible" size="small" style="width:80%">
                <el-form-item label="部门名称：" prop="departName">
                  <el-input v-model="form.depart.departName"></el-input>
                </el-form-item>
                <el-form-item label="父节点："> <!--v-show="!saveBtvisible"-->
                  <el-input v-model="parentDepartName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属地区：" prop="areaId">
                  <el-cascader :options="areaTree" :props="defaultprops"  v-model="form.depart.areaId" :show-all-levels="false" :change-on-select="true" style="width:100%">
                  </el-cascader>
                </el-form-item>
                  <div>
                    <!-- <el-rule-button ruleCode="depManage_update">-->
                    <el-button icon="el-icon-edit" type="primary" size="small"  @click="depUpd" v-show="saveBtvisible">修改保存</el-button>
                    <!--  </el-rule-button>
                      <el-rule-button ruleCode="depManage_add">-->
                    <el-button icon="el-icon-plus" type="primary" size="small" @click="saveClick" v-show="!saveBtvisible">新增保存</el-button>
                    <!-- </el-rule-button>-->
                  </div>

              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
  </base-layout>
</template>
<script>
  import '../../assets/css/rightManage.styl'
  export default {
    data() {
      return {
        radio: 1,
        labelPosition: 'center',
        saveBtvisible: true,
        detailvisible: false,
        choose: false,
        //新增表单、查看
        form: {
          depart: {
            "departName": null,
            "parentDepartId": null,
            "areaId": []
          }
        },
        formClear: {
          depart: {
            "departName": null,
            "parentDepartId": null,
            "areaId": []
          }
        },
        //数据验证
        rules: {
          departName: [{
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }],
          areaId: [{
            required: true,
            message: '请选择所属地区',
            trigger: 'change',
            type:'array'
          }]
        },
        deleteNum: {
          "departId": []
        },
        defaultprops: {
          value: "dataId",
          label: "label",
          children: "children"
        },
        departName:null,
        departId:null,
        parentDepartId:null,
        parentDepartName:null
      }
    },
    methods: {
      nodeClick: function(node) {
        this.$refs['addnewForm'].resetFields();
        this.parentDepartId= node.parentId;
        this.detailvisible = true;
        this.choose = true;
        this.departName=node.label;
        this.departId=node.dataId;
        var url='/system/depart/query'
        this.$fetch.doGet(url,node.dataId).then(
          (resp) => {
          if (resp.returnCode == "1") {
          this.form.depart = resp.data.depart;
          this.parentDepartName = resp.data.depart.parentDepartName;
          this.form.depart.areaId = this.$util.getCascaderSelectIds(this.areaTree,this.form.depart.areaId,'dataId','children');
        }
      }, (error) => {
          this.$message.error(error);
        })

        this.saveBtvisible = true;
        this.parentDepartId=node.parentId;
        this.parentDepartName = node.label;
        this.deleteNum.departId=[];
        if (!node.children) {
          this.deleteNum.departId.push(node.dataId)
        } else {
          this.deleteNum.departId = [];
        }
      },
      addnewClick: function() {
        if (this.choose) {
          this.deleteNum.departId = [];
          this.form = JSON.parse(JSON.stringify(this.formClear));
          this.saveBtvisible = false;
          this.detailvisible = true;
          //this.form.depart.parentDepartId=this.parentDepartId;
          this.parentDepartName=this.departName;
          this.form.depart.parentDepartId=this.departId;

        } else {
          this.$message.warning("请先在左边列表选中父节点");
        }
      },
      saveClick: function() {
        var cloneForm = JSON.parse(JSON.stringify(this.form));
        cloneForm.depart.areaId=cloneForm.depart.areaId.splice(-1)[0];
        this.$refs['addnewForm'].validate((valid) => {
          if (valid) {
            var url='/system/depart/add'
            this.$fetch.doPost(url,cloneForm).then(
              (resp) => {
              if (resp.returnCode == "1") {
              this.$message.success("新增成功");
              this.saveBtvisible = true;
              this.$store.dispatch("getDeptTree");
            }
          }, (error) => {
              this.$message.error(error);
            }
          )
          } else {
            return false;
          }
        });
      },

      depUpd: function() {
        var cloneForm = JSON.parse(JSON.stringify(this.form));
        cloneForm.depart.areaId=cloneForm.depart.areaId.splice(-1)[0];
        this.$refs['addnewForm'].validate((valid) => {
          if (valid) {
            var url='/system/depart/update'
            this.$fetch.doPost(url,cloneForm).then(
              (resp) => {
              if (resp.returnCode == "1") {
              this.$message.success("修改成功");
              this.$store.dispatch("getDeptTree");
            }
          }, (error) => {
              this.$message.error(error);
            }
          )
          } else {
            return false;
          }
        });
      },
      depDel: function() {
        var url='/system/depart/delete'
        this.$fetch.doPost(url,this.deleteNum).then(
          (resp) => {
          if (resp.returnCode == "1") {
          this.$message.success("删除成功");
          this.deleteNum.departId = [];
          this.$store.dispatch("getDeptTree");
          this.choose = false;
        }
      }, (error) => {
          this.$message.error(error);
        }
        )
      },
      deleClick: function() {
        if (!this.deleteNum.departId.length) {
          this.$message.warning("未选中部门或者选中部门下有子部门");
        } else {
          this.$confirm('确认删除部门？').then(() => {
            this.depDel();
          this.detailvisible = false;
        }).catch(() => {});
        }
      },
    },
    computed: {
      departTree: function() {
        return this.$store.getters.departTree
      },
      areaTree: function () {
        return this.$store.getters.areaTree
      },
    }
  }
</script>
