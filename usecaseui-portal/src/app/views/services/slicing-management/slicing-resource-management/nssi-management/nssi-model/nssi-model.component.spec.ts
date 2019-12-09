import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NssiModelComponent } from './nssi-model.component';

describe('NssiModelComponent', () => {
  let component: NssiModelComponent;
  let fixture: ComponentFixture<NssiModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NssiModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NssiModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
