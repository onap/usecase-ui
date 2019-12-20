import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SlicingTaskServices } from '.././../../../core/services/slicingTaskServices';
import { TASK_PROCESSING_STATUS } from '../../../../../constants/constants';

@Component({
  selector: 'app-slicing-task-management',
  templateUrl: './slicing-task-management.component.html',
  styleUrls: ['./slicing-task-management.component.less']
})
export class SlicingTaskManagementComponent implements OnInit {

  constructor(private myhttp: SlicingTaskServices, private message: NzMessageService) { }

  showDetail: boolean = false;
  showProcess: boolean = false;
  selectedValue = 'all';
  taskId: string;
  moduleTitle: string = "";
  moduleOperation: string;
  listOfData: any[] = [];
  statusOptions: any[] = TASK_PROCESSING_STATUS;
  loading: boolean = false;
  total: number = 1;
  pageSize: string = '10';
  pageNum: string = '1';

  ngOnInit() {
    this.getTaskList();
  }

  getTaskList(): void {
    const { pageNum, pageSize } = this;
    this.loading = true;
    this.myhttp.getSlicingTaskList(pageNum, pageSize).subscribe(res => {
      const { result_header: { result_code }, result_body } = res
      if (+result_code === 200) {
        const { slicing_task_list, record_number } = result_body;
        this.dataFormatting(slicing_task_list);
        this.total = record_number;
      } else {
        this.message.error('Failed to get form data');
      }
      this.loading = false;
    }, ({ status, statusText }) => {
      this.message.error(status + ' (' + statusText + ')');
      this.loading = false;
    })
  }

  processingStatusChange(): void {
    this.pageSize = '10';
    this.pageNum = '1';
    if (this.selectedValue && this.selectedValue !== 'all') {
      this.getListOfProcessingStatus();
    } else {
      this.getTaskList();
    }
  }

  getListOfProcessingStatus(): void {
    const { selectedValue, pageNum, pageSize } = this;
    this.loading = true;
    this.myhttp.getTaskProcessingStatus(selectedValue, pageNum + '', pageSize + '').subscribe(res => {
      const { result_header: { result_code }, result_body } = res
      if (+result_code === 200) {
        const { slicing_task_list, record_number } = result_body;
        this.dataFormatting(slicing_task_list)
        this.total = record_number;
      } else {
        this.message.error('Failed to get form data');
      }
      this.loading = false;
    }, ({ status, statusText }) => {
      this.message.error(status + ' (' + statusText + ')');
      this.listOfData = [];
      this.loading = false;
    })
  }

  pageSizeChange(pageSize: number): void {
    this.pageSize = pageSize + '';
    const { selectedValue } = this;
    if (selectedValue && selectedValue !== 'all') {
      this.getListOfProcessingStatus();
    } else {
      this.getTaskList();
    }
  }

  pageNumChange(pageNum: number): void {
    this.pageNum = pageNum + '';
    const { selectedValue } = this;
    if (selectedValue && selectedValue !== 'all') {
      this.getListOfProcessingStatus();
    } else {
      this.getTaskList();
    }
  }

  dataFormatting(list: any): void {
    this.listOfData = list.map(item => {
      switch (item.processing_status) {
        case 'Planning':
          // item.status = '规划阶段';
          item.operation = 'Process Task'
          break;
        case 'WaitingToConfirm':
          // item.status = '审核阶段';
          item.operation = 'Process Task'
          break;
        case 'WaitingToConfirm':
          // item.status = '审核阶段';
          item.operation = 'Process Task'
          break;
        case 'Creating':
          // item.status = '切片创建中';
          item.operation = 'View Progress'
          break;
        case 'Completed':
          // item.status = '创建完成';
          item.operation = 'View Result'
          break;
      }
      return item;
    })
  }

  showdetail(data: any): void {
    this.taskId = data.task_id;
    this.moduleTitle = data.task_name;
    if (data.processing_status === 'Waiting to Confirm' || data.processing_status === 'WaitingToConfirm') {
      this.showDetail = true;
    } else {
      this.moduleOperation = data.operation;
      this.showProcess = true;
    }
  }

  handelCancel(obj: any): void {
    this.showDetail = obj.showDetail;
    if (obj.bool) {
      if (this.selectedValue && this.selectedValue !== 'all') {
        this.getListOfProcessingStatus();
      } else {
        this.getTaskList();
      }
    }
  }
}
