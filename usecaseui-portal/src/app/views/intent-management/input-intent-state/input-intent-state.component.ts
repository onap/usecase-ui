import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Util } from '../../../shared/utils/utils';

@Component({
  selector: 'app-input-intent-state',
  templateUrl: './input-intent-state.component.html',
  styleUrls: ['../intent-management.component.less']
})
export class InputIntentStateComponent implements OnInit {

  constructor(
    private Util: Util
  ) { }

  currentIndex:number = -1;
  listOfData: any[] = [];
  intentConditionShow: boolean = false;
  editConditionTableList: Object={};

  ngOnInit() {
    this.operatorList = [
      { label:'EQUALTO', value:'EQUALTO'},
      { label:'LARGETHAN', value:'LARGETHAN'},
      { label:'LESSTHAN', value:'LESSTHAN'}
    ]
    this.conditionType = 'value'
  }
  @Input() showModel: boolean;
  @Output() modalOpreation = new EventEmitter();
  @Input() editTargetTableData;

  defaultParams:Object={
    targetId:'',
    targetName:'',
    targetConditions:[]
  };

  operatorList: any[] = [];
  conditionType: string;

  ngOnChanges() {
    if (this.showModel) {
      if (JSON.stringify(this.editTargetTableData)!=='{}') {
        this.defaultParams=this.editTargetTableData
      }
    }
	}
  handleCancel(): void {
    this.modalOpreation.emit({ "cancel": true });
    this.clearTargetConditionData()
  }
  handleOk(): void {
    if(JSON.stringify(this.editTargetTableData)==='{}'){
      this.defaultParams['targetId']=this.Util.getUuid()
    }
    this.modalOpreation.emit({ "cancel": false, "param": this.defaultParams });
    this.clearTargetConditionData()
  }
  inputTargetConditionShow(): void {
    this.intentConditionShow = true;
  }
  inputIntentConditionClose($event: any): void {
    this.intentConditionShow = false;
    this.editConditionTableList={}
    if ($event.cancel) {
        return;
    }
    if(this.currentIndex>-1){
      this.listOfData[this.currentIndex]=$event.param
      this.currentIndex=-1
    }else{
      this.listOfData.push($event.param)
    }
    this.defaultParams['targetConditions']=this.listOfData
  }
  editConditionList(data,i): void {
    this.editConditionTableList=JSON.parse(JSON.stringify(data))
    this.currentIndex=i
    this.intentConditionShow = true
  }
  deleteConditionList(i): void{
    this.listOfData.splice(i,1)
  }
  clearTargetConditionData(): void{
    this.showModel = false;
    this.defaultParams = {
      targetId:'',
      targetName:'',
      targetConditions:[]
    };
    this.listOfData=[]
  }

}
