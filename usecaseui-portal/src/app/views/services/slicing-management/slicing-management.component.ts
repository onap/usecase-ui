import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slicing-management',
  templateUrl: './slicing-management.component.html',
  styleUrls: ['./slicing-management.component.less']
})
export class SlicingManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
    currentTab = 'Slicing Task Management';
    handleTabChange($event): void {
        console.log($event,"$event");
        this.currentTab = $event.tab._title;
    }
}
