import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleModelComponent } from './scale-model.component';

describe('ScaleModelComponent', () => {
  let component: ScaleModelComponent;
  let fixture: ComponentFixture<ScaleModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaleModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
