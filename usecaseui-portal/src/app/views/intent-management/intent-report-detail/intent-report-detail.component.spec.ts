import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentReportDetailComponent } from './intent-report-detail.component';

describe('IntentReportDetailComponent', () => {
  let component: IntentReportDetailComponent;
  let fixture: ComponentFixture<IntentReportDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentReportDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
