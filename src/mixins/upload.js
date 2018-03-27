/**
 * Created by Administrator on 2017/11/17.
 */
export default {
  methods:{
    checkUploadFileType:function(file){
      var reg = /(\.html|\.jsp|\.php)$/;
      return !reg.test(file.name)
    }
  }
};
