import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputIntentExpectationComponent } from './input-intent-expectation.component';

describe('InputIntentExpectationComponent', () => {
  let component: InputIntentExpectationComponent;
  let fixture: ComponentFixture<InputIntentExpectationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputIntentExpectationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputIntentExpectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
