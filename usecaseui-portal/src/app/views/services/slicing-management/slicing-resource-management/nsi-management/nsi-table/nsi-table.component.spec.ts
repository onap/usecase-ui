import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsiTableComponent } from './nsi-table.component';

describe('NsiTableComponent', () => {
  let component: NsiTableComponent;
  let fixture: ComponentFixture<NsiTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsiTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
