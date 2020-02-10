import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOrderComponent } from './business-order.component';

describe('BusinessOrderComponent', () => {
  let component: BusinessOrderComponent;
  let fixture: ComponentFixture<BusinessOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
