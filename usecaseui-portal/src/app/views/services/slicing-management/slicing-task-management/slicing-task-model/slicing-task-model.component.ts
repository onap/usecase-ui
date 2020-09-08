import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SlicingTaskServices } from '@src/app/core/services/slicingTaskServices';
import { indexDebugNode } from '@angular/core/src/debug/debug_node';

@Component({
  selector: 'app-slicing-task-model',
  templateUrl: './slicing-task-model.component.html',
  styleUrls: ['./slicing-task-model.component.less']
})
export class SlicingTaskModelComponent implements OnInit {
  @Input() showDetail: boolean;
  @Input() moduleTitle: string;
  @Input() taskId: string;
  @Output() cancel = new EventEmitter<object>();
  @ViewChild('notification') notification1: any;

  constructor(private http: SlicingTaskServices) { }

  // 配置审核详情
  checkDetail: any[] = [{}];
  //业务需求信息
  businessRequirement: any[] = [];
  //匹配NST信息 
  NSTinfo: object[] = [{}];
  // 共享切片实例
  selectedServiceId: string;
  selectedServiceName: string;
  slicingInstances: any;
  //an/tn/cn instances NSSI ID下拉框的开关
  enableNSSISelectionList: any[] = []
  // 子网实例
  slicingSubnet: any[] = [
    {
      title: 'An',
      context: 'an',
      slicingId: '',
      slicingName: '',
      total: 0,
      currentPage: '1',
      pageSize: '10',
      isLoading: false,
      flag: false,
      instances: []
    },
    {
      title: 'Tn',
      context: 'tn',
      slicingId: '',
      slicingName: '',
      total: 0,
      currentPage: '1',
      pageSize: '10',
      isLoading: false,
      flag: false,
      instances: []
    },
    {
      title: 'Cn',
      context: 'cn',
      slicingId: '',
      slicingName: '',
      total: 0,
      currentPage: '1',
      pageSize: '10',
      isLoading: false,
      flag: false,
      instances: []
    }
  ]
  isDisabled: any = [true,true,true]
  // 子网参数
  isShowParams: boolean;
  paramsTitle: string;
  params: any;
  // 获取数据loading
  isSpinning: boolean = false;
  loading: boolean = false;


  ngOnInit() { }

  ngOnChanges() {
    if (this.showDetail) {
      this.isSpinning = true;
      this.getautidInfo();
    } else {
      this.isDisabled.map(item=>{
        item = true
      })
    }
  }

  // used for picking some key-value pairs from a object. 
  pick(obj, arr): Object {
    return arr.reduce((iter, val) => {
      if(val in obj) {
        iter[val] = obj[val];
      }
      return iter;
    }, {});
  }

  getautidInfo(): void {
    let getAuditInfoFailedCallback  = () => {
      this.isSpinning = false;
    } 
    this.http.getAuditInfo(this.taskId, getAuditInfoFailedCallback).then( res => {
      this.isSpinning = false;
      const {
        business_demand_info,
        nst_info,
        nsi_nssi_info,
        ...checkInfo
      } = res.result_body;
      // 处理配置审核详情数据
      this.checkDetail = [{...checkInfo, 'service_snssai': business_demand_info.service_snssai}];
      // 业务需求信息数据
      business_demand_info.area = business_demand_info.coverage_area_ta_list.map(item => {
        item = item.split(';').join(' - ')
        return item
      })
      // 前端模拟数据
      let areaList = ["Haidian District;Beijing;Beijing", "Xicheng District;Beijing;Beijing", "Changping District;Beijing;Beijing"].map(item => {
        item = item.split(';').join(' - ')
        return item
      })
      this.businessRequirement = [{ ...business_demand_info, area: areaList }];
      // 匹配NST信息
      this.NSTinfo = [nst_info];
      // 共享切片实例
      this.selectedServiceId = nsi_nssi_info.suggest_nsi_id;
      this.selectedServiceName = nsi_nssi_info.suggest_nsi_name;
      // an/tn/cn 3 select box switches parameters of Matching Shared NSSI
      this.enableNSSISelectionList = [nsi_nssi_info.an_enableNSSISelection,nsi_nssi_info.tn_enableNSSISelection,nsi_nssi_info.cn_enableNSSISelection];
      if (!this.selectedServiceId || !this.selectedServiceName) {
        this.isDisabled.map((item,index)=>{
          this.isDisabled[index] = false
        })
      }
      this.isDisabled.map((item,index)=>{
        if(this.enableNSSISelectionList[index]){
          this.isDisabled[index] = false
        }
      })
      this.slicingInstances = {
        currentPage: '1',
        pageSize: '10',
        isLoading: false,
        total: 0,
        flag: false,
        list: [{
          service_instance_id: this.selectedServiceId,
          service_instance_name: this.selectedServiceName
        }]
      }
      // 子网实例
      let subnetData = this.pick(nsi_nssi_info, ['an_suggest_nssi_id', 'an_suggest_nssi_name', 'tn_suggest_nssi_id', 'tn_suggest_nssi_name', 'cn_suggest_nssi_id', 'cn_suggest_nssi_name']);
      this.subnetDataFormatting(subnetData, 0);
      // 前端模拟数据
      let area = ["Beijing;Beijing;Haidian District", "Beijing;Beijing;Xicheng District", "Beijing;Beijing;Changping District"];
      this.slicingSubnet[0].params = {...this.pick(nsi_nssi_info, [
              'sliceProfile_AN_sNSSAI',
              'sliceProfile_AN_resourceSharingLevel',
              'sliceProfile_AN_uEMobilityLevel',
              'an_latency',
              'sliceProfile_AN_maxNumberofUEs',
              'sliceProfile_AN_activityFactor',
              'sliceProfile_AN_expDataRateDL',
              'sliceProfile_AN_expDataRateUL',
              'sliceProfile_AN_areaTrafficCapDL',
              'sliceProfile_AN_areaTrafficCapUL',
              'an_script_name',
              'sliceProfile_AN_overallUserDensity',
              'an_enableNSSISelection',
              'sliceProfile_AN_maxNumberofPDUSession',
              'sliceProfile_AN_ipAddress',
              'sliceProfile_AN_logicInterfaceId',
              'sliceProfile_AN_nextHopInfo'
          ]), an_coverage_area_ta_list: area};
      this.slicingSubnet[1].params = this.pick(nsi_nssi_info, ['tn_latency', 'tn_bandwidth', 'tn_script_name', 'sliceProfile_TN_jitte', 'sliceProfile_TN_sNSSAI',"tn_enableNSSISelection"]);
      this.slicingSubnet[2].params = {...this.pick(nsi_nssi_info, [
        'cn_service_snssai',
        'cn_resource_sharing_level',
        'cn_ue_mobility_level',
        'cn_latency',
        'cn_max_number_of_ues',
        'cn_activity_factor',
        'cn_exp_data_rate_dl',
        'cn_exp_data_rate_ul',
        'cn_area_traffic_cap_dl',
        'cn_area_traffic_cap_ul',
        'cn_script_name',
        'sliceProfile_CN_overallUserDensity',
        'cn_enableNSSISelection',
        'sliceProfile_CN_maxNumberofPDUSession',
        'sliceProfile_CN_logicInterfaceId',
        'sliceProfile_CN_ipAddress',
        'sliceProfile_CN_nextHopInfo'
      ])};
    })
  }

  openSlicingInstance(bool: boolean): void {
    const { total, currentPage, pageSize } = this.slicingInstances;
    if (bool && !total) {
      this.slicingInstances.list = [];
      this.getSlicingInstances(currentPage, pageSize)
    }
  }

  getNextPageData(): void {
    const { total, currentPage, pageSize } = this.slicingInstances;
    if (total - (+currentPage * +pageSize) > 0) {
      if (this.slicingInstances.flag) return;
      this.slicingInstances.flag = true
      this.getSlicingInstances(currentPage, pageSize)
      this.slicingInstances.currentPage = (+this.slicingInstances.currentPage + 1).toString();
    }
  }

  getSlicingInstances(pageNo: string, pageSize: string): void {
    this.slicingInstances.isLoading = true;
    let getSlicingInstanceFailedCallback  = () => {
      this.slicingInstances.isLoading = false;
      this.slicingInstances.flag = false;
    }
    this.http.getSlicingInstance(pageNo, pageSize, getSlicingInstanceFailedCallback).then(res => {
      const { result_body } = res;
      setTimeout(() => {
        const { nsi_service_instances, record_number } = result_body;
        this.slicingInstances.total = record_number;
        this.slicingInstances.list.push(...nsi_service_instances);
        this.slicingInstances.isLoading = false;
        this.slicingInstances.flag = false;
      }, 2000)
    })
  }


  slicingInstanceChange(): void { // choose the target nssi
    this.isDisabled.map((item,index)=>{
      if (!this.enableNSSISelectionList[index]) {
        this.isDisabled[index] = true
      }
    })
    this.selectedServiceName = '';
    // 获取切片子网实例数据

    let getSlicingSubnetInstanceFailedCallback = () => {
      this.subnetDataFormatting({}, 1);
    };
    this.http.getSlicingSubnetInstance(this.selectedServiceId, getSlicingSubnetInstanceFailedCallback).then(res => {
      const { result_body, record_number} = res;
      this.subnetDataFormatting(result_body, record_number)
    })
    this.slicingInstances.list.forEach(item => {
      if (item.service_instance_id === this.selectedServiceId) {
        this.selectedServiceName = item.service_instance_name;
      }
    })
  }

  subnetDataFormatting ( subnetData?: any, total?: number): void{
    const { an_suggest_nssi_id, an_suggest_nssi_name, tn_suggest_nssi_id, tn_suggest_nssi_name, cn_suggest_nssi_id, cn_suggest_nssi_name } = subnetData;
    this.slicingSubnet[0].slicingId = an_suggest_nssi_id;
    this.slicingSubnet[0].slicingName = an_suggest_nssi_name;
    this.slicingSubnet[0].total = total;
    this.slicingSubnet[0].currentPage = '1';
    this.slicingSubnet[0].instances = [{
      service_instance_id: an_suggest_nssi_id,
      service_instance_name: an_suggest_nssi_name
    }];

    this.slicingSubnet[1].slicingId = tn_suggest_nssi_id;
    this.slicingSubnet[1].slicingName = tn_suggest_nssi_name;
    this.slicingSubnet[1].total = total;
    this.slicingSubnet[1].currentPage = '1';
    this.slicingSubnet[1].instances = [{
      service_instance_id: tn_suggest_nssi_id,
      service_instance_name: tn_suggest_nssi_name
    }];

    this.slicingSubnet[2].slicingId = cn_suggest_nssi_id;
    this.slicingSubnet[2].slicingName = cn_suggest_nssi_name;
    this.slicingSubnet[2].total = total;
    this.slicingSubnet[2].currentPage = '1';
    this.slicingSubnet[2].instances = [{
      service_instance_id: cn_suggest_nssi_id,
      service_instance_name: cn_suggest_nssi_name
    }];
  }

  resetSlicingInstance(): void {
    this.selectedServiceId = '';
    this.selectedServiceName = '';
    this.slicingSubnet.map(item => {
      item.slicingId = '';
      item.slicingName = '';
    })
    this.isDisabled.map((item,index)=>{
      this.isDisabled[index] = false
    })
  }

  openSubnetInstances(bool: boolean, instance: any): void {
    if (bool && !instance.total) {
      instance.instances = []
      this.getSubnetInstances(instance)
    }
  }

  getNextPageSubnet(instance: any): void {
    const { total, currentPage, pageSize } = instance;
    if (total - (+currentPage * +pageSize) > 0) {
      if (instance.flag) return;
      instance.flag = true;
      this.getSubnetInstances(instance);
      let count = +instance.currentPage;
      instance.currentPage = (++count).toString();
    }
  }

  getSubnetInstances(instance: any): void {
    instance.isLoading = true;
    const { context, currentPage, pageSize } = instance;
    let getSubnetInContextFailedCallback = () => {
      instance.isLoading = false;
      instance.flag = false;
    };
    this.http.getSubnetInContext(context, currentPage, pageSize,getSubnetInContextFailedCallback).then(res => {
      const { result_body } = res;
      const { nssi_service_instances, record_number } = result_body;
      this.slicingSubnet.map(item => {
        if (item.context === context) {
          item.total = record_number;
          item.instances.push(...nssi_service_instances);
        }
      })
      instance.isLoading = false;
      instance.flag = false;
    })
  }

  slicingSubnetChange(instance: any): void {
    instance.slicingName = ''
    instance.instances.forEach(item => {
      if (instance.slicingId === item.service_instance_id) {
        instance.slicingName = item.service_instance_name;
      }
    })
  }

  restSubnetInstance(instance: any): void {
    instance.slicingId = '';
    instance.slicingName = '';
  }

  showParamsModel(item: any): void {
    this.isShowParams = true;
    this.paramsTitle = item.title;
    this.params = item.params
  }

  changeParams(params: any): void {
    const index = this.paramsTitle === 'An' ? 0 : (this.paramsTitle === 'Tn' ? 1 : 2);
    this.slicingSubnet[index].params = params
  }

  handleCancel(bool: boolean = false) {
    this.showDetail = false;
    this.cancel.emit({ showDetail: this.showDetail, bool });
  }
  handleOk() {
    this.loading = true;
    const { selectedServiceId, selectedServiceName, slicingSubnet, checkDetail, businessRequirement, NSTinfo } = this;
    const nsi_nssi_info: object = {
      suggest_nsi_id: selectedServiceId,
      suggest_nsi_name: selectedServiceName,
      an_suggest_nssi_id: slicingSubnet[0].slicingId,
      an_suggest_nssi_name: slicingSubnet[0].slicingName,
      ...slicingSubnet[0].params,
      tn_suggest_nssi_id: slicingSubnet[1].slicingId,
      tn_suggest_nssi_name: slicingSubnet[1].slicingName,
      ...slicingSubnet[1].params,
      cn_suggest_nssi_id: slicingSubnet[2].slicingId,
      cn_suggest_nssi_name: slicingSubnet[2].slicingName,
      ...slicingSubnet[2].params,
    }
    delete businessRequirement[0].area
    let reqBody = { ...checkDetail[0], business_demand_info: businessRequirement[0], nst_info: NSTinfo[0], nsi_nssi_info };
    delete reqBody.service_snssai;
    let submitSlicingFailedCallback =  () => {
      this.loading = false;
      this.notification1.notificationFailed('Task', 'Sumbit', this.taskId)
    }
    this.http.submitSlicing(reqBody,submitSlicingFailedCallback).then(res => {
      this.notification1.notificationSuccess('Task', 'Sumbit', this.taskId)
      this.loading = false;
      this.handleCancel(true);
    })
  }
}
