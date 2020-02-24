import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderServiceComponent } from './order-service.component';

describe('OrderServiceComponent', () => {
  let component: OrderServiceComponent;
  let fixture: ComponentFixture<OrderServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
