import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceDetailsComponent } from './performance-details.component';

describe('PerformanceDetailsComponent', () => {
  let component: PerformanceDetailsComponent;
  let fixture: ComponentFixture<PerformanceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
