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
import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MyhttpService} from "./myhttp.service";
import {HomesService} from "./homes.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

    constructor(private translate: TranslateService,private myhttp: HomesService) {
        this.currentLanguageGet();
        translate.addLangs(['en', 'zh']);
        // translate.use('en');
    }

  
  Language:String[] = ["zh","en"];
    //209.05.08 Get the currentLanguage
    currentloginId = null;
    currentLanguage = "en";
    currentLanguageGet() {
        this.currentloginId = sessionStorage.getItem("loginId") || null;
        if (this.currentloginId != null) {
            this.myhttp.getCurrentLanguage(this.currentloginId)
                .subscribe(
                    (data) => {
                        this.currentLanguage = data.languageName.toLowerCase();
                        this.translate.use(this.currentLanguage);
                    },
                    (err) => {
                        console.log(err);
                    }
                )
        }else {
           this.translate.setDefaultLang('en');
        }
    }

    selectLanguage = "en";

  changeLanguage(item){
    this.selectLanguage = item;
    this.translate.use(item);
  }
}
