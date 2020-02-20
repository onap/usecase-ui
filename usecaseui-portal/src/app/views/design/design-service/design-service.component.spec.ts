import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignServiceComponent } from './design-service.component';

describe('DesignServiceComponent', () => {
  let component: DesignServiceComponent;
  let fixture: ComponentFixture<DesignServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
