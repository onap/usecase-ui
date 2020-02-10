import { Component, OnInit, HostBinding } from '@angular/core';
import { slideToRight } from '../../../shared/utils/animates';

@Component({
  selector: 'app-slicing-management',
  templateUrl: './slicing-management.component.html',
  styleUrls: ['./slicing-management.component.less'],
  animations: [slideToRight]
})
export class SlicingManagementComponent implements OnInit {

  @HostBinding('@routerAnimate') routerAnimateState;

  constructor() { }

  ngOnInit() {
  }
    currentTab = 'communication Service';
    handleTabChange($event): void {
        console.log($event,"$event");
        this.currentTab = $event.tab._title;
    }
}
