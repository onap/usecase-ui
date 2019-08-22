import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService, TranslateFakeLoader} from '@ngx-translate/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';
import { PieComponent } from '../../shared/components/charts/pie/pie.component'; 
import { BarComponent } from '../../shared/components/charts/bar/bar.component'; 
import { LineComponent } from '../../shared/components/charts/line/line.component';
import { HomesService } from '../../core/services/homes.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, PieComponent, BarComponent, LineComponent ],
      imports: [TranslateModule.forRoot({loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),        
              NgZorroAntdModule, 
              NgxEchartsModule, 
              HttpClientModule,
              BrowserAnimationsModule,
              RouterTestingModule],
      providers: [HomesService, TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
