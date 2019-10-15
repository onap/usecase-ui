import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealModelComponent } from './heal-model.component';

describe('HealModelComponent', () => {
  let component: HealModelComponent;
  let fixture: ComponentFixture<HealModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
