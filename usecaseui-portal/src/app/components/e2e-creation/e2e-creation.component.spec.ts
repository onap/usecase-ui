import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { E2eCreationComponent } from './e2e-creation.component';

describe('E2eCreationComponent', () => {
  let component: E2eCreationComponent;
  let fixture: ComponentFixture<E2eCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ E2eCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(E2eCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
