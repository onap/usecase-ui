import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingBusinessManagementComponent } from './slicing-business-management.component';

describe('SlicingBusinessManagementComponent', () => {
  let component: SlicingBusinessManagementComponent;
  let fixture: ComponentFixture<SlicingBusinessManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingBusinessManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingBusinessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
