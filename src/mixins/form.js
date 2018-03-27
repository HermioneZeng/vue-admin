export default {
    data() {
    },
    methods:{
      resetForm:function(name){
        this.$refs[name].resetFields();
      },
      validateForm:function(name){
        return this.$refs[name].validate();
      },
      operBefore:function(title,array) {
        if (array && !array.length) {
          this.$message({
            type: 'warning',
            message: `请选择${title}的行`
          });
          return;
        }
        var content = `确认执行${title}操作`;
        var p = this.$confirm(content,title);
        return p;
      },
      beforeOper:function(title,array) {
        if (array && !array.length) {
          this.$message({
            type: 'warning',
            message: `请选择${title}的行`
          });
          return;
        }
        var content = `确认执行${title}操作`;
        var p = this.$confirm(content,title);
        return p;
      }
    }
}
