import { Component, OnInit, HostBinding } from '@angular/core';
import { slideToRight } from '../../../shared/utils/animates';

@Component({
  selector: 'app-sotn-management',
  templateUrl: './sotn-management.component.html',
  styleUrls: ['./sotn-management.component.less'],
  animations: [slideToRight]
})
export class SotnManagementComponent implements OnInit {

  @HostBinding('@routerAnimate') routerAnimateState;

  currentTab = 'Order Service';

  constructor() { }

  ngOnInit() {
  }
  
  handleTabChange($event): void {
      console.log($event,"$event");
      this.currentTab = $event.tab._title;
  }
}
