import axios from 'axios';


export default function http (url:string,data:object = {},method:any = 'get',query?:string | object):any {
  return new Promise((resolve,reject) => {
    method = method.trim().toLocaleLowerCase()
    let promise:any;
    if(method === 'get' || method === 'delete'){
      // 若无参数则不传递data
      let options:object;
      if(JSON.stringify(data) === '{}'){
        options = { method, url };
      }else{
        options = { method, url, params: data};
      }

      // 若请求方式为delete请求，则携带请求头
      if(method === 'delete'){

      }

      promise = axios(options);

    }else if (method === 'post' || method === 'put') {
      if(method === 'post' && query){
        let params:string;
        if(<string>query){
          query = JSON.parse((<string>query));
        }
        for(let key in <object>query){
          params = '&' + key + '=' + query[key];
        }
        params = params.slice(1);
        url += '?' + params;
      }
      promise = axios({
        method,
        url,
        data,
      })
    }
    promise
      .then((response) => {
        // 请求成功返回携带成功状态及响应数据的promise对象
        if(response.status === 200 || 304){
          resolve(response.data)
        }else{
          reject(response)
        }
      })
      .catch((error) => {
        if(error.status === 404){
          reject('请求资源不存在')
        }else{
          reject(error.message)
        }
        
      })

  })
}


