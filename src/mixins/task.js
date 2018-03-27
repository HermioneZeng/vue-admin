
export default {
  methods:{
    downloadUrl(url){
      let iframe = document.getElementById('downloadIframe');
      if(!iframe){
        iframe = document.createElement('iframe');
        iframe.setAttribute('id','downloadIframe');
        iframe.style.display = 'none';
      }
      iframe.src = url;
      document.body.appendChild(iframe);
    }
  }
};
