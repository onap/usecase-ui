/*
    Copyright (C) 2018 CMCC, Inc. and others. All rights reserved.

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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { TranslateModule, TranslateLoader, TranslateService, TranslateFakeLoader} from '@ngx-translate/core';

import { CcvpnDetailComponent } from './ccvpn-detail.component';
import { MyhttpService } from '../myhttp.service';

describe('CcvpnDetailComponent', () => {
  let component: CcvpnDetailComponent;
  let fixture: ComponentFixture<CcvpnDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcvpnDetailComponent ],
      imports: [ TranslateModule.forRoot({loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
                 NgZorroAntdModule.forRoot(), HttpClientModule  ],
      providers: [ MyhttpService, { provide: NZ_I18N, useValue: en_US } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let detailshow = false;
    detailData:Object;
    let serviceDetail(service){
      service["siteSer"]=[];
      service["sdwanSer"]=[];
      service["customer"]=this.customerSelected;
      service["serviceType"] = this.serviceTypeSelected;
  
      service.childServiceInstances.forEach((item)=>{
        if(item.serviceDomain=="SITE"){
          service.siteSer.push(item);
        }else if(item.serviceDomain=="SDWAN"){
          service.sdwanSer.push(item);
        }
      })
      this.detailshow = true;
      this.detailData = service;
      component.detailParams = this.detailData
    fixture = TestBed.createComponent(CcvpnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log(component);
    expect(component).toBeTruthy();
  });
});
