import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slicing-task-management',
  templateUrl: './slicing-task-management.component.html',
  styleUrls: ['./slicing-task-management.component.less']
})
export class SlicingTaskManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  showDetail: boolean = false;
  selectedValue = null;
  detailData: object = {};
  moduleTitle: string = "";
  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      status: 0
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      status: 0
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      status: 1
    }
  ];
  showdetail(data: any) {
    console.log(data, this.showDetail)
    this.detailData = data;
    this.showDetail = true;
    this.moduleTitle = data.status === 0 ? "Check Configuration" : "View Progress";
  }
}
