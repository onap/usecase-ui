import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NssiTableComponent } from './nssi-table.component';

describe('NssiTableComponent', () => {
  let component: NssiTableComponent;
  let fixture: ComponentFixture<NssiTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NssiTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NssiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
