import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingManagementComponent } from './slicing-management.component';

describe('SlicingManagementComponent', () => {
  let component: SlicingManagementComponent;
  let fixture: ComponentFixture<SlicingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
