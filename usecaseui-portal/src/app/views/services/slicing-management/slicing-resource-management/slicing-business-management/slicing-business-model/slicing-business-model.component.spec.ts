import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicingBusinessModelComponent } from './slicing-business-model.component';

describe('SlicingBusinessModelComponent', () => {
  let component: SlicingBusinessModelComponent;
  let fixture: ComponentFixture<SlicingBusinessModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlicingBusinessModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicingBusinessModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
