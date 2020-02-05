import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsmfSlicingBusinessManagementComponent } from './csmf-slicing-business-management.component';

describe('CsmfSlicingBusinessManagementComponent', () => {
  let component: CsmfSlicingBusinessManagementComponent;
  let fixture: ComponentFixture<CsmfSlicingBusinessManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsmfSlicingBusinessManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsmfSlicingBusinessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
