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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TextService {
  constructor(private http: HttpClient) { }
  //---------------------------------------------------------------------------------------
  /* line up*/
  baseUrl = "/api";
  url = {
    textInterface: this.baseUrl + "/user/login",
    singleInterface: this.baseUrl + "/home",
    doubleInterface: this.baseUrl + "/customer/info",
    multipleInterface: this.baseUrl + "/alarm/formdata/multiple",
    jsonInterface: this.baseUrl + "/xuran/test/data",
  }

  //-----------------------------------Function-local-start------------------------------------------------------
  /* Query data list */
  getfakeData() {
    return this.http.get<any>(this.url["singleInterface"]);
  }
  getjsonData() {
    return this.http.get<any>(this.url["multipleInterface"]);
  }
  //-------------------------------------------------------------------------------------

}
