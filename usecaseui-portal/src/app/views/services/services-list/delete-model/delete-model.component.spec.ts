import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModelComponent } from './delete-model.component';

describe('DeleteModelComponent', () => {
  let component: DeleteModelComponent;
  let fixture: ComponentFixture<DeleteModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
