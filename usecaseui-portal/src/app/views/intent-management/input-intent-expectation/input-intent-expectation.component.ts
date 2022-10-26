import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Util } from '../../../shared/utils/utils';

@Component({
  selector: 'app-input-intent-expectation',
  templateUrl: './input-intent-expectation.component.html',
  styleUrls: ['../intent-management.component.less']
})
export class InputIntentExpectationComponent implements OnInit {

  constructor(
    private Util: Util
  ) { }

  @Input() showModel: boolean;
  @Output() modalOpreation = new EventEmitter();
  @Input() editExpectationTableData;

  defaultParams:Object={
    expectationId:'',
    expectationName:'',
    expectationType:'DELIVERY',
    expectationObject:{
      objectType:'CCVPN',
      objectInstance:'',
    },
    expectationTargets:[]
  };
  currentIndex:number = -1;

  listOfData: any[] = [];

  intentTargetShow: boolean = false;
  editTargetTableList: Object={};

  expectationTypeList: any[] = [];
  expectationObjectTypeList: any[] = [];

  ngOnInit() {
    this.expectationTypeList = [
      { label:'DELIVERY', value:'DELIVERY' },
      { label:'ASSURANCE', value:'ASSURANCE' }
    ]
    this.expectationObjectTypeList = [
      { label:'CCVPN', value:'CCVPN' },
      { label:'SLICING', value:'SLICING' }
    ]
  }

  ngOnChanges() {
    if (this.showModel) {
      if (JSON.stringify(this.editExpectationTableData)!=='{}') {
        this.defaultParams=this.editExpectationTableData
        this.listOfData=this.defaultParams['expectationTargets']
      }
    }
	}

  handleCancel(): void {
    this.modalOpreation.emit({ "cancel": true });
    this.clearExpectationData()
  }
  handleOk(): void {
    if(JSON.stringify(this.editExpectationTableData)==='{}'){
      this.defaultParams['expectationId']=this.Util.getUuid()
    }
    this.modalOpreation.emit({ "cancel": false, "param": this.defaultParams });
    this.clearExpectationData()
  }
  editTargetList(data,i): void {
    this.editTargetTableList=JSON.parse(JSON.stringify(data))
    this.currentIndex=i
    this.intentTargetShow = true
  }
  deleteTargetList(i): void{
    this.listOfData.splice(i,1)
  }
  clearExpectationData(): void{
    this.showModel = false;
    this.defaultParams = {
      expectationId:'',
      expectationName:'',
      expectationType:'DELIVERY',
      expectationObject:{
        objectType:'CCVPN',
        objectInstance:'',
      },
      expectationTargets:[]
    };
    this.listOfData=[]
  }
  inputIntentTargetShow(): void {
    this.intentTargetShow = true;
  }
  inputIntentStateClose($event: any): void {
    this.intentTargetShow = false;
    this.editTargetTableList={}
    if ($event.cancel) {
        return;
    }
    if(this.currentIndex>-1){
      this.listOfData[this.currentIndex]=$event.param
      this.currentIndex=-1
    }else{
      this.listOfData.push($event.param)
    }
    this.defaultParams['expectationTargets']=this.listOfData
  }

}
