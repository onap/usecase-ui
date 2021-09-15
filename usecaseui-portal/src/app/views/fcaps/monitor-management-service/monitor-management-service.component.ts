import { Component, HostBinding, OnInit } from '@angular/core';
import { slideToRight } from '../../../shared/utils/animates';

@Component({
  selector: 'app-monitor-management-service',
  templateUrl: './monitor-management-service.component.html',
  styleUrls: ['./monitor-management-service.component.less'],
  animations: [slideToRight]
})
export class MonitorManagementService implements OnInit {

  @HostBinding('@routerAnimate') routerAnimateState;

  constructor() { }

  ngOnInit() {
  }
}