import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceVmComponent } from './performance-vm.component';

describe('PerformanceVmComponent', () => {
  let component: PerformanceVmComponent;
  let fixture: ComponentFixture<PerformanceVmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceVmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceVmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
