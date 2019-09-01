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

export default function http(url: string, data: object = {}, method: any = 'get', query?: string | object): any {
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

      if (method === 'delete') {

      }

      promise = axios(options);

    } else if (method === 'post' || method === 'put') {
      if (method === 'post' && query) {
        let params: string = '';
        if (<string>query) {
          query = JSON.parse((<string>query));
        }
        Object.keys(query).forEach(item => {
          params += '&' + item + '=' + query[item];
        })
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
        if (response.status === 200 || 304) {
          resolve(response.data)
        } else {
          reject(response)
        }
      })
      .catch((error) => {
        reject(error.message)
      })

  })
}


