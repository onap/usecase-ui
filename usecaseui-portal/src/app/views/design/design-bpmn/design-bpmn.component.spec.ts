import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignBpmnComponent } from './design-bpmn.component';

describe('DesignBpmnComponent', () => {
  let component: DesignBpmnComponent;
  let fixture: ComponentFixture<DesignBpmnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignBpmnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignBpmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
