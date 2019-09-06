import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { OnboardVnfVmComponent } from './onboard-vnf-vm.component';
import { onboardService } from '../../../core/services/onboard.service';

describe('OnboardVnfVmComponent', () => {
  let component: OnboardVnfVmComponent;
  let fixture: ComponentFixture<OnboardVnfVmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      imports: [TranslateModule, HttpClientModule],
      declarations: [ OnboardVnfVmComponent ],
      providers: [onboardService, NzMessageService, NzModalService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardVnfVmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
