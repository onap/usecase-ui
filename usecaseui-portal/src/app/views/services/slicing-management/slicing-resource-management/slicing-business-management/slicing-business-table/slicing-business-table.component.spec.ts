import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingBusinessTableComponent } from './slicing-business-table.component';

describe('SlicingBusinessTableComponent', () => {
  let component: SlicingBusinessTableComponent;
  let fixture: ComponentFixture<SlicingBusinessTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingBusinessTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingBusinessTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
