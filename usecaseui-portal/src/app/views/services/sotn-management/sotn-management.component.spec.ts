import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SotnManagementComponent } from './sotn-management.component';

describe('SotnManagementComponent', () => {
  let component: SotnManagementComponent;
  let fixture: ComponentFixture<SotnManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SotnManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SotnManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
