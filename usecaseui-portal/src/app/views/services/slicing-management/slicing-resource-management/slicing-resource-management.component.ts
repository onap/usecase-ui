import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slicing-resource-management',
  templateUrl: './slicing-resource-management.component.html',
  styleUrls: ['./slicing-resource-management.component.less']
})
export class SlicingResourceManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
    currentTab = 'Slicing Business Management';
    handleTabChange($event): void {
       console.log($event,"$event");
       this.currentTab = $event.tab._title;
    }
}
