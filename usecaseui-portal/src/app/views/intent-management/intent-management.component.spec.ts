import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentManagementComponent } from './intent-management.component';

describe('IntentManagementComponent', () => {
  let component: IntentManagementComponent;
  let fixture: ComponentFixture<IntentManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
