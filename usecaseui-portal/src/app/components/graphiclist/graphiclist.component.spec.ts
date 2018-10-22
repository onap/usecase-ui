import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphiclistComponent } from './graphiclist.component';

describe('GraphiclistComponent', () => {
  let component: GraphiclistComponent;
  let fixture: ComponentFixture<GraphiclistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphiclistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphiclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
