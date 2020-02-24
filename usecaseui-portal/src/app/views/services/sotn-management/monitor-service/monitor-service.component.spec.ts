import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorServiceComponent } from './monitor-service.component';

describe('MonitorServiceComponent', () => {
  let component: MonitorServiceComponent;
  let fixture: ComponentFixture<MonitorServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
