import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService, TranslateFakeLoader} from '@ngx-translate/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerformanceDetailsComponent } from '../../../shared/components/performance-details/performance-details.component';
import { GraphiclistComponent } from '../../../shared/components/graphiclist/graphiclist.component';
import { PerformanceVnfComponent } from './performance-vnf.component';
import { HomesService } from '../../../core/services/homes.service';

describe('PerformanceVnfComponent', () => {
  let component: PerformanceVnfComponent;
  let fixture: ComponentFixture<PerformanceVnfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceVnfComponent, PerformanceDetailsComponent, GraphiclistComponent ],
      imports: [ TranslateModule.forRoot({loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
         NgZorroAntdModule.forRoot(),
         NgxEchartsModule,
         HttpClientModule,
         BrowserAnimationsModule ],
      providers: [TranslateService, HomesService ],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceVnfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});