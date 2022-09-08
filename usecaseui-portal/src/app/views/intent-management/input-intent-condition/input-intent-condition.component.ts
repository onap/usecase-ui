import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Util } from '../../../shared/utils/utils';

@Component({
  selector: 'app-input-intent-condition',
  templateUrl: './input-intent-condition.component.html',
  styleUrls: ['../intent-management.component.less']
})
export class InputIntentConditionComponent implements OnInit {

  constructor(
    private Util: Util
  ) { }

  @Input() showModel: boolean;
  @Output() modalOpreation = new EventEmitter();
  @Input() editConditionTableData;

  defaultParams:Object={
    conditionId:'',
    conditionName:'',
    operator:'EQUALTO',
    conditionValue:'',
    conditionList:null
  };
  conditionType: string;
  operatorList: any[] = [];

  ngOnChanges() {
    // this.defaultParams=this.editConditionTableData
    // if(this.editConditionTableData['conditionList'] === null){
    //   this.conditionType='value'
    // }else{
    //   this.conditionType='list'
    //   this.secondParams=this.editConditionTableData['conditionList']
    // }
    if (this.showModel) {
      if (JSON.stringify(this.editConditionTableData)!=='{}') {
        this.defaultParams=this.editConditionTableData
      }
      console.log(this.editConditionTableData)
    }
	}
  ngOnInit() {
    this.conditionType = 'value'
    this.operatorList = [
      { label:'EQUALTO', value:'EQUALTO'},
      { label:'LARGETHAN', value:'LARGETHAN'},
      { label:'LESSTHAN', value:'LESSTHAN'}
    ]
  }
  handleCancel(): void {
    this.modalOpreation.emit({ "cancel": true });
    this.clearConditionData()
  }
  handleOk(): void {
    if(JSON.stringify(this.editConditionTableData)==='{}'){
      this.defaultParams['conditionId']=this.Util.getUuid()
    }
    console.log(this.defaultParams)
    this.modalOpreation.emit({ "cancel": false, "param": this.defaultParams });
    this.clearConditionData()
  }
  handleChange(event){
    this.defaultParams['operator']=event
  }
  clearConditionData(){
    this.conditionType = 'value'
    this.defaultParams={
      conditionId:'',
      conditionName:'',
      operator:'EQUALTO',
      conditionValue:'',
      conditionList:null
    };
  }

}
