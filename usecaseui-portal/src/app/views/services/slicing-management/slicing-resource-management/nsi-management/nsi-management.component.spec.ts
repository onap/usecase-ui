import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsiManagementComponent } from './nsi-management.component';

describe('NsiManagementComponent', () => {
  let component: NsiManagementComponent;
  let fixture: ComponentFixture<NsiManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsiManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsiManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
