import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcapsComponent } from './fcaps.component';

describe('FcapsComponent', () => {
  let component: FcapsComponent;
  let fixture: ComponentFixture<FcapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
