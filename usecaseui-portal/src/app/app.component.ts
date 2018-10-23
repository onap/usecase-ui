import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private translate:TranslateService){
    translate.addLangs(['en', 'zh']);
    translate.setDefaultLang('en');
    // translate.use('en');
  }
  changeLanguage(Language): void {
    switch(Language){
      case 'en':
        this.translate.use('en');
        break;
      case 'zh':
        this.translate.use('zh');
    }
  }
  // 多语言
  Language:String[] = ["zh","en"];
  selectLanguage = "en";
  changeLanguage1(){
    this.translate.use(this.selectLanguage);
  }
  changeLanguage2(item){
    this.translate.use(item);
  }
}
