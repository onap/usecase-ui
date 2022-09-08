import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputIntentStateComponent } from './input-intent-state.component';

describe('InputIntentStateComponent', () => {
  let component: InputIntentStateComponent;
  let fixture: ComponentFixture<InputIntentStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputIntentStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputIntentStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
