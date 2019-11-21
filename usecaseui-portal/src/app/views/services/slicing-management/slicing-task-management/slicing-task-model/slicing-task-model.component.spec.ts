import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingTaskModelComponent } from './slicing-task-model.component';

describe('SlicingTaskModelComponent', () => {
  let component: SlicingTaskModelComponent;
  let fixture: ComponentFixture<SlicingTaskModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingTaskModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingTaskModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
