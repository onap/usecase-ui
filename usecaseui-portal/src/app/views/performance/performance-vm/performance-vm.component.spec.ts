import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerformanceVmComponent } from './performance-vm.component';

describe('PerformanceVmComponent', () => {
  let component: PerformanceVmComponent;
  let fixture: ComponentFixture<PerformanceVmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceVmComponent ],
      imports: [ 
        BrowserAnimationsModule
      ]
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

  it('should test performanceShow method to set proper values', () => {
    component.performanceShow();
    expect(component.state).toBe('show');
    expect(component.state2).toBe('hide');
    expect(component.state3).toBe('hide');
    expect(component.graphicshow).toBe(false);
    expect(component.detailshow).toBe(false);
  });

  it('should test graphicShow method to set proper values', () => {
    component.graphicShow();
    expect(component.state).toBe('hide');
    expect(component.state2).toBe('show');
    expect(component.state3).toBe('hide');
    expect(component.graphicshow).toBe(true);
    expect(component.detailshow).toBe(false);
  });

  it('should test detailShow method to set proper values', () => {
    component.detailShow({id:1});
    expect(component.state).toBe('hide');
    expect(component.state2).toBe('hide');
    expect(component.state3).toBe('show');
    expect(component.graphicshow).toBe(true);
    expect(component.detailshow).toBe(true);
    expect(component.detailId).toBe(1);
  });

  it('should test choseSourceName method', () => {
    component.choseSourceName('bbbb');
    expect(component.sourceNameSelected).toBe('bbbb');
  });

  it('should test choseSourceName method', () => {
    component.choseReportingEntityName('bbbb');
    expect(component.ReportingEntityNameSelected).toBe('bbbb');
  });

});
