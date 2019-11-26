import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NssiManagementComponent } from './nssi-management.component';

describe('NssiManagementComponent', () => {
  let component: NssiManagementComponent;
  let fixture: ComponentFixture<NssiManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NssiManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NssiManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
