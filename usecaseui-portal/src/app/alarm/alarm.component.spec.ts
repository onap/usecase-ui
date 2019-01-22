import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule, TranslateLoader, TranslateService, TranslateFakeLoader} from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd';

import { AlarmComponent } from './alarm.component';
import { DetailsComponent } from '../components/details/details.component';
import { LineComponent } from '../components/charts/line/line.component';
import { HomesService } from '../homes.service';

fdescribe('AlarmComponent', () => {
  let component: AlarmComponent;
  let fixture: ComponentFixture<AlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmComponent, DetailsComponent, LineComponent ],
      imports: [ TranslateModule.forRoot({loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),        
        NgZorroAntdModule.forRoot(), 
        NgxEchartsModule, 
        HttpClientModule,
        BrowserAnimationsModule ],
      providers: [ TranslateService, HomesService,
                   { provide: NZ_I18N, useValue: en_US } ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
