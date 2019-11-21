import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingResourceManagementComponent } from './slicing-resource-management.component';

describe('SlicingResourceManagementComponent', () => {
  let component: SlicingResourceManagementComponent;
  let fixture: ComponentFixture<SlicingResourceManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingResourceManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingResourceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
