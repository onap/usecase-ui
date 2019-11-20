import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Monitor5gComponent } from './monitor-5g.component';

describe('Monitor5gComponent', () => {
  let component: Monitor5gComponent;
  let fixture: ComponentFixture<Monitor5gComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Monitor5gComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Monitor5gComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
