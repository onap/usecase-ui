import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcvpnDetailComponent } from './ccvpn-detail.component';

describe('CcvpnDetailComponent', () => {
  let component: CcvpnDetailComponent;
  let fixture: ComponentFixture<CcvpnDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcvpnDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcvpnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
