import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardVnfVmComponent } from './onboard-vnf-vm.component';

describe('OnboardVnfVmComponent', () => {
  let component: OnboardVnfVmComponent;
  let fixture: ComponentFixture<OnboardVnfVmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardVnfVmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardVnfVmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
