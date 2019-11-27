import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ServiceListService } from '.././../../../core/services/serviceList.service'

@Component({
  selector: 'app-slicing-task-management',
  templateUrl: './slicing-task-management.component.html',
  styleUrls: ['./slicing-task-management.component.less']
})
export class SlicingTaskManagementComponent implements OnInit {

  constructor(private myhttp: ServiceListService) { }

  ngOnInit() { 
    this.getTaskList()
  }
  showDetail: boolean = false;
  selectedValue = null;
  detailData: object = {};
  moduleTitle: string = "";
  listOfData = []; 
  getTaskList (): void{
    this.myhttp.getSlicingTaskList(1,10).subscribe (res => {
      const { result_header: { result_code }, result_body: { slicing_task_list } } = res
      if (+result_code === 200) {
        this.listOfData = slicing_task_list.map( item => {
          item.arrival_time = moment(+item.arrival_time).format('YYYY-MM-DD hh:mm')
          switch (item.processing_status){
            case 'Planning':
              item.status = '规划阶段';
              break;
            case 'Waiting to Confirm':
              item.status = '审核阶段';
              break;
            case 'Creating':
              item.status = '切片创建中';
              break;
            case 'Completed': 
              item.status = '创建完成';
              break;
          }
          return item;
        })
      }
    })
  }
  showdetail(data: any) {
    console.log(data, this.showDetail)
    this.detailData = data;
    this.showDetail = true;
    this.moduleTitle = data.status === 0 ? "Check Configuration" : "View Progress";
  }
}
