import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingTaskManagementComponent } from './slicing-task-management.component';

describe('SlicingTaskManagementComponent', () => {
  let component: SlicingTaskManagementComponent;
  let fixture: ComponentFixture<SlicingTaskManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingTaskManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingTaskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
