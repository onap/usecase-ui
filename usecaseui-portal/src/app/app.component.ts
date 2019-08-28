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
import {MyhttpService} from "./core/services/myhttp.service";
import {HomesService} from "./core/services/homes.service";
import {NavigationEnd, Router} from '@angular/router';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
    public url:string = 'home';

    constructor(private translate: TranslateService,private myhttp: HomesService,private router:Router,) {
        this.currentLanguageGet();
        this.getUrl();

        
    }
    getUrl(){
        this.router.events.map(event=> {
            if(event instanceof NavigationEnd){
                this.url = event['url'].slice(1)
            }
            }).subscribe(event=>{})
    }


    //209.05.08 Get the currentLanguage
    currentloginId = null;
    currentLanguage = "en";
    currentLanguageGet() {
        this.currentloginId = sessionStorage.getItem("userId") || null;
		console.log(this.currentloginId,"this.currentloginId","loginId");
        if (this.currentloginId != null) {
            console.log(this.currentloginId,"this.currentloginId","loginId","you id");
            this.myhttp.getCurrentLanguage(this.currentloginId)
                .subscribe(
                    (data) => {
                        console.log(data,"-------------getCurrentLanguage");
                        this.currentLanguage = data.languageAlias.toLowerCase();
                        this.translate.use(this.currentLanguage);
                        sessionStorage.setItem("DefaultLang",this.currentLanguage);
                    },
                    (err) => {
                        console.log(err);
                    }
                )
        }else {
            this.translate.setDefaultLang(this.currentLanguage);
            sessionStorage.setItem("DefaultLang",this.currentLanguage);
        }
    }
    get flag () {
        if(!this.url.indexOf('services')){
            return true
        }else{
            return false
        }
    }
  
}
