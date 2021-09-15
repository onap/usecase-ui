import { Component, HostBinding, OnInit } from '@angular/core';
import { slideToRight } from '../../../shared/utils/animates';

@Component({
  selector: 'app-intent-based-services',
  templateUrl: './intent-based-services.component.html',
  styleUrls: ['./intent-based-services.component.less'],
  animations: [slideToRight]
})
export class IntentBasedServicesComponent implements OnInit {

  @HostBinding('@routerAnimate') routerAnimateState;
  selectedIndex:number = 0;
  constructor() { }

  ngOnInit() {
  }
  handleTabChange($event): void {
    this.selectedIndex = $event.index;
  }
}