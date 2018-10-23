import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceVnfComponent } from './performance-vnf.component';

describe('PerformanceVnfComponent', () => {
  let component: PerformanceVnfComponent;
  let fixture: ComponentFixture<PerformanceVnfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceVnfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceVnfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
