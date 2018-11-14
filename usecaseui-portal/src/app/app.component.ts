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

  // 多语言
  Language:String[] = ["zh","en"];
  selectLanguage = "en";

  changeLanguage(item){
    this.selectLanguage = item;
    this.translate.use(item);
  }
}
