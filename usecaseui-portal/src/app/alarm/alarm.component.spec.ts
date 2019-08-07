import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule, TranslateLoader, TranslateService, TranslateFakeLoader} from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
        BrowserAnimationsModule,
        HttpClientTestingModule ],
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

  it('should create', inject([HttpTestingController, HomesService], 
    (httpMock: HttpTestingController, service: HomesService) => {
    expect(component).toBeTruthy();
  }));

  it('expects service to fetch data with proper sorting',
  inject([HttpTestingController, HomesService],
    (httpMock: HttpTestingController, service: HomesService) => {
      // We call the service
      service.getqueryAllSourceNames().subscribe(data => {
        expect(data.pageInfo.totalRecordCount).toBe(21);
        expect(data.pageInfo.pageNumber).toBe(0);
        expect(data.data.length).toBe(7);
      });
      // We set the expectations for the HttpClient mock
      const req = httpMock.expectOne('http://.../data/contacts');
      expect(req.request.method).toEqual('GET');
      // Then we set the fake data to be returned by the mock
      req.flush({data: ...});
    })
);
});
