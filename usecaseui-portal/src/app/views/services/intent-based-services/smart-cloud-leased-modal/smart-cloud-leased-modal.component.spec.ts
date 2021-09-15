import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBusinessOrderComponent } from './input-business-order.component';

describe('InputBusinessOrderComponent', () => {
  let component: InputBusinessOrderComponent;
  let fixture: ComponentFixture<InputBusinessOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputBusinessOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputBusinessOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
