import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputIntentConditionComponent } from './input-intent-condition.component';

describe('InputIntentConditionComponent', () => {
  let component: InputIntentConditionComponent;
  let fixture: ComponentFixture<InputIntentConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputIntentConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputIntentConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
