import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SlicingTaskServices } from '../../../../../core/services/slicingTaskServices';
import { BUSINESS_REQUIREMENT } from '../../../../../../constants/constants';

@Component({
  selector: 'app-slicing-task-model',
  templateUrl: './slicing-task-model.component.html',
  styleUrls: ['./slicing-task-model.component.less']
})
export class SlicingTaskModelComponent implements OnInit {
  @Input() showDetail: boolean;
  @Input() moduleTitle: string;
  @Input() taskId: string;
  @Output() cancel = new EventEmitter<boolean>();

  constructor(private http: SlicingTaskServices) { }

  // 业务需求列表
  businessList: object[] = BUSINESS_REQUIREMENT;
  // 配置审核详情
  checkDetail: object[] = [{}];
  //业务需求信息
  businessRequirement: object[] = [{}];
  //匹配NST信息 
  NSTinfo: object[] = [{}];
  // 共享切片实例
  selectedServiceId: string;
  selectedServiceName: string;
  // 子网实例
  slicingSubnet: any[] =  [
    {
      title: '无线域',
      slicingId: '',
      slicingName: ''
    },
    {
      title: '传输域',
      slicingId: '',
      slicingName: ''
    },
    {
      title: '核心网域',
      slicingId: '',
      slicingName: ''
    }
  ]

  ngOnInit() { }
  
  ngOnChanges() {
    if (this.showDetail) {
      this.getautidInfo();
    }
  }

  getautidInfo(): void {
    this.http.getAuditInfo(this.taskId).subscribe( res => {
      const { result_header: { result_code } } = res;
      if (+result_code === 200) {
        const { task_id, task_name, create_timer, processing_status, business_demand_info, nst_info, nsi_nssi_info, business_demand_info: { service_snssai } } = res.result_body;
        const { 
          suggest_nsi_id, 
          suggest_nsi_name, 
          an_suggest_nssi_id, 
          an_suggest_nssi_name, 
          tn_suggest_nssi_id, 
          tn_suggest_nssi_name, 
          cn_suggest_nssi_id, 
          cn_suggest_nssi_name } = nsi_nssi_info;
        // 处理配置审核详情数据
        this.checkDetail = [{ task_id, task_name, create_timer, processing_status, service_snssai }];
        // 业务需求信息数据
        this.businessRequirement = [business_demand_info];
        this.NSTinfo = [nst_info];
        // 共享切片实例
        this.selectedServiceId = suggest_nsi_id;
        this.selectedServiceName = suggest_nsi_name;
        // 子网实例
        this.slicingSubnet[0].slicingId = an_suggest_nssi_id;
        this.slicingSubnet[0].slicingName = an_suggest_nssi_name;
        this.slicingSubnet[1].slicingId = tn_suggest_nssi_id;
        this.slicingSubnet[1].slicingName = tn_suggest_nssi_name;
        this.slicingSubnet[2].slicingId = cn_suggest_nssi_id;
        this.slicingSubnet[2].slicingName = cn_suggest_nssi_name;
      }
    })
  }






  serviceId = ['46da8cf8-0878-48ac-bea3-f2200959411a', '46da8cf8-0878-48ac-bea3-f2200959411b', '46da8cf8-0878-48ac-bea3-f2200959411c'];
  serviceData: {} = {
    "46da8cf8-0878-48ac-bea3-f2200959411a": "eMBB instancela",
    "46da8cf8-0878-48ac-bea3-f2200959411b": "eMBB instancelb",
    "46da8cf8-0878-48ac-bea3-f2200959411c": "eMBB instancelc",
  };



  serviceIdChange(value: string): void {
    this.selectedServiceName = this.serviceData[value];
    console.log(this.selectedServiceName, "=====")
  }
  resetService() {
    this.selectedServiceId = "";
    this.serviceIdChange(this.selectedServiceId);
  }

  handleCancel() {
    this.showDetail = false;
    this.cancel.emit(this.showDetail);
  }
  handleOk() {
    this.handleCancel();
    // 对应操作逻辑未编写

  }
}
