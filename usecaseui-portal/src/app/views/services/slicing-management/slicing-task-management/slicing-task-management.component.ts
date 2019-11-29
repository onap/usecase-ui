import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SlicingTaskServices } from '.././../../../core/services/slicingTaskServices';
import { TASK_PROCESSING_STATUS } from '../../../../../constants/constants';

@Component({
  selector: 'app-slicing-task-management',
  templateUrl: './slicing-task-management.component.html',
  styleUrls: ['./slicing-task-management.component.less']
})
export class SlicingTaskManagementComponent implements OnInit {

  constructor(private myhttp: SlicingTaskServices) { }

  ngOnInit() { 
    this.getTaskList()
  }
  showDetail: boolean = false;
  selectedValue = null;
  // detailData: object = {};
  taskId: string;
  moduleTitle: string = "";
  listOfData: any[] = []; 
  statusOptions: any[] = TASK_PROCESSING_STATUS;

  getTaskList (): void{
    this.myhttp.getSlicingTaskList('1', '10').subscribe (res => {
      const { result_header: { result_code }, result_body: { slicing_task_list } } = res
      if (+result_code === 200) {
        this.dataFormatting(slicing_task_list)
      }
    })
  }
  getListOfProcessingStatus():void {
    this.myhttp.getTaskProcessingStatus(this.selectedValue, '1', '10').subscribe (res => {
      const { result_header: { result_code }, result_body: { slicing_task_list } } = res
      if (+result_code === 200) {
        this.dataFormatting(slicing_task_list)
      }
    })
  }
  
  dataFormatting(list: any):void{
    this.listOfData = list.map( item => {
      item.arrival_time = moment(+item.arrival_time).format('YYYY-MM-DD hh:mm')
      switch (item.processing_status){
        case 'Planning':
          item.status = '规划阶段';
          item.operation = '任务处理'
          break;
        case 'Waiting to Confirm':
          item.status = '审核阶段';
          item.operation = '任务处理'
          break;
        case 'Creating':
          item.status = '切片创建中';
          item.operation = '查看进度'
          break;
        case 'Completed': 
          item.status = '创建完成';
          item.operation = '查看结果'
          break;
      }
      return item;
    })
  }

  showdetail(data: any): void {
    this.taskId = data.task_id;
    this.showDetail = true;
    this.moduleTitle = data.status;
  }
}
