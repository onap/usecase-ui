/*
    Copyright (C) 2019 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import axios from 'axios';
import { NzMessageService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';
@Injectable()
export class Http {
  constructor(private message: NzMessageService) {
  }
  httpAxios(method: any = 'get', url: string, data?:string | object, callback?:any): any {
    return new Promise((resolve, reject) => {
      method = method.trim().toLocaleLowerCase()
      let promise: any;
      if (method === 'get' || method === 'delete') {
        let options: object;
        if (JSON.stringify(data) === '{}') {
          options = { method, url };
        } else {
          options = { method, url, params: data };
        }
        promise = axios(options);

      } else if (method === 'put' || method === 'post') {
        promise = axios({
          url,
          method,
          data
        })
      }
      promise
        .then((response) => {
          console.log(response,"------> response")
          if (response.status === 200 || 304) {
            const { result_header: { result_code, result_message } } = response.data
            if(+result_code === 200){
              resolve(response.data)
            }else{
              this.message.error(result_message || "Network exception, please try again.")
              if(callback)callback();
            } 
          } else {
            if(callback)callback();
            this.message.error("Network exception, please try again.")
          }
        })
        .catch((error) => {
          this.message.error(error || "Network exception, please try again.")
        })

    })
  }

}
