import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcvpnCreationComponent } from './ccvpn-creation.component';

describe('CcvpnCreationComponent', () => {
  let component: CcvpnCreationComponent;
  let fixture: ComponentFixture<CcvpnCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcvpnCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcvpnCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
