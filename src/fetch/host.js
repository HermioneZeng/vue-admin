let hostIp = '';//192.168.102.224:9962 192.168.102.118:9962 //http://111.200.45.118:9080/itemapi/
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == 'development') {
  hostIp = 'http://192.168.102.79:9962';
}else if(process.env.NODE_ENV == 'production'){
  hostIp = '';
}
export default{
  hostIp
}
