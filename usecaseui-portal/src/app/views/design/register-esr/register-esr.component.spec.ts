import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEsrComponent } from './register-esr.component';

describe('RegisterEsrComponent', () => {
  let component: RegisterEsrComponent;
  let fixture: ComponentFixture<RegisterEsrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterEsrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
