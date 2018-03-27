<template>

    <base-layout :fBorder="false" :cBorder="false">
      <div slot="header" style="position: relative">
        <span>地区管理</span>
      </div>
      <template slot="table_content">
          <div class="form_con">
              <el-row>
                  <el-col :span="4">
                      <p class="tree_header">地区结构</p>
                      <el-tree :data="areaTree" accordion highlight-current @node-click="nodeClick" class="leftTree"></el-tree>
                  </el-col>
                  <el-col :span="20">
                      <div class="main-right">
                          <div class="title border-bottom">
                              <span class="sub-title">地区配置:</span>
                                <el-button icon="el-icon-plus" size="small" type="info" plain @click="addnewClick">新增</el-button>
                                <el-button icon="el-icon-delete" size="small" type="info" plain @click="delClick">删除</el-button>
                          </div>
                      </div>
                      <div class="form_box" v-show="show">
                          <el-form label-width="100px" :model="form.area" :rules="rules" ref="ruleForm"  size="small">
                              <el-form-item label="地区名称：" prop="areaName">
                                  <el-input v-model="form.area.areaName" size="small"></el-input>
                              </el-form-item>
                              <el-form-item label="区号：" prop="areaCode">
                                  <el-input v-model="form.area.areaCode"  size="small"></el-input>
                              </el-form-item>
                              <el-form-item label="父节点：" v-show="!saveBtvisible">
                                  <el-input v-model="this.parentAreaName" :disabled="true"  size="small"></el-input>
                              </el-form-item>
                              <el-form-item>
                                  <div style="text-align:left">
                                      <el-button type="primary" @click="updClick" v-show="saveBtvisible">修改保存</el-button>
                                      <el-button type="primary" @click="saveClick" v-show="!saveBtvisible">新增保存</el-button>
                                  </div>
                              </el-form-item>
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
            choose: false,
            show: false,
            saveBtvisible: false,
            parentAreaName: null,
            parentAreaId: null,
            //新增表单、查看
            form: {
                "area": {
                    areaId: null,
                    areaCode:'',
                    areaName: '',
                    parentAreaId: null,
                }
            },
            formClear: {
                "area": {
                    areaId: null,
                    areaCode:'',
                    areaName: '',
                    parentAreaId: null,
                }
            },
            deleteNum: {
                "areaId": []
            },
            //数据验证
            rules: {
                areaName: [{
                    required: true,
                    message: '请输入地区名称',
                    trigger: 'blur'
                }]
            },
        }
    },
    methods: {
        nodeClick: function (node,data) {
            this.choose = true;
            this.show = true;
            this.saveBtvisible = true;
            if (!node.children) {
                this.deleteNum.areaId.push(node.dataId);
            } else {
                this.deleteNum.areaId = [];
            }
            console.log(data);
            this.form.area.areaName = node.label;
            this.form.area.parentAreaId = node.parentId;
            this.form.area.areaId = node.dataId;
            this.form.area.areaCode = node.areaCode;
            this.parentAreaName = node.label;
            this.parentAreaId = node.dataId;
        },
     /*   getSingleArea: function (id) {
            this.$fetch.getSingleArea(id).then(
                (resp) => {
                    if (resp.data.returnCode == "0") {
                        this.form.area = resp.data.data.map
                    }
                }, (error) => {
                    this.$message.error(error);
                }
            )
        },*/
        //新增保存
        saveClick: function () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                  var url='/system/area/add'
                    this.$fetch.doPost(url,this.form).then(
                        (resp) => {
                            if (resp.returnCode == "1") {
                                this.$store.dispatch("getAreaTree");
                                this.$message.success("新增成功");
                                this.saveBtvisible = true;
                            }
                        }, (error) => {
                            this.$message.error(error);
                        }
                    )
                } else {
                    return false;
                }
            })
        },
        //修改保存
        updClick: function () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    var url='/system/area/update'
                    this.$fetch.doPost(url,this.form).then(
                        (resp) => {
                            if (resp.returnCode == "1") {
                                this.$store.dispatch("getAreaTree");
                                this.$message.success("修改成功");
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
        //删除
        delClick: function () {
            if (!this.deleteNum.areaId.length) {
                this.$message.warning("未选中地区或者选中地区下有子地区");
            } else {
                this.$confirm('确认删除地区？').then(() => {
                    var url='/system/area/delete';
                    this.$fetch.doPost(url,this.deleteNum).then(
                        (resp) => {
                            if (resp.returnCode == "1") {
                                this.$store.dispatch("getAreaTree");
                                this.$message.success("删除成功");
                                this.deleteNum.areaId = [];
                                this.choose = false;
                            }
                        }, (error) => {
                            this.$message.error(error);
                        }
                    )
                    this.show = false;
                }).catch(() => {});
            }
        },
        //新增
        addnewClick: function () {
            if (this.choose) {
                this.show = true;
                this.saveBtvisible = false;
                this.deleteNum.areaId = [];
                this.form.area.areaName = '';
                this.form.area.areaId = '';
                this.form.area.areaCode = '';
                this.form.area.parentAreaId = this.parentAreaId;
            } else {
                this.$message.warning("请先在左边列表选中父节点");
            }
        }
    },
    computed: {
      areaTree: function () {
          return this.$store.getters.areaTree
      }
    },
    created: function () {

    }
}
</script>
