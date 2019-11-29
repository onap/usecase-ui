import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnetParamsModelComponent } from './subnet-params-model.component';

describe('SubnetParamsModelComponent', () => {
  let component: SubnetParamsModelComponent;
  let fixture: ComponentFixture<SubnetParamsModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubnetParamsModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubnetParamsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
