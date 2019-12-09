import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsiModelComponent } from './nsi-model.component';

describe('NsiModelComponent', () => {
  let component: NsiModelComponent;
  let fixture: ComponentFixture<NsiModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsiModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsiModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
