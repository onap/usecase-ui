import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';

import { DeleteModelComponent } from './delete-model.component';

fdescribe('DeleteModelComponent', () => {
  let component: DeleteModelComponent;
  let fixture: ComponentFixture<DeleteModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteModelComponent ],
      imports: [ TranslateModule.forRoot(), NgZorroAntdModule.forRoot(), FormsModule ],
      providers: [ { provide: NZ_I18N, useValue: en_US } ]
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
