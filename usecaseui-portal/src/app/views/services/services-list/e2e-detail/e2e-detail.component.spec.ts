import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { E2eDetailComponent } from './e2e-detail.component';

describe('E2eDetailComponent', () => {
  let component: E2eDetailComponent;
  let fixture: ComponentFixture<E2eDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ E2eDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(E2eDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
