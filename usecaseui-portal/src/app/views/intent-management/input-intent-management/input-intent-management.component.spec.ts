import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputIntentManagementComponent } from './input-intent-management.component';

describe('InputIntentManagementComponent', () => {
  let component: InputIntentManagementComponent;
  let fixture: ComponentFixture<InputIntentManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputIntentManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputIntentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
