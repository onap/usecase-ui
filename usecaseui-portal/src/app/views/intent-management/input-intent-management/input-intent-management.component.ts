import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IntentManagementService } from '../../../core/services/intentManagement.service';
import { Util } from '../../../shared/utils/utils';
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-input-intent-management',
  templateUrl: './input-intent-management.component.html',
  styleUrls: ['../intent-management.component.less']
})
export class InputIntentManagementComponent implements OnInit {

  constructor(
    private myhttp: IntentManagementService,
    private Util: Util,
    private message: NzMessageService,
  ) { }
  defaultParams:Object={
    intentId:'',
    intentName:'',
    intentExpectations:[
      {
        expectationId:'',
        expectationName:'',
        expectationType:'',
        expectationObject:{
          objectType:'',
          objectInstance:''
        },
        expectationTargets:[
          {
            targetId:'',
            targetName:'',
            targetCondition:{
              conditionId:'',
              conditionName:'',
              operator:'',
              conditionValue:'',
              conditionList:null
            }
          }
        ]
      }
    ],
  };
  currentIndex:number = -1;
  intentExpectationShow: boolean = false;
  editExpectationTableList: Object={};

  listOfData: any[] = [];

  @Input() showModel: boolean;
  @Input() editIntentTableData;
  @Output() modalOpreation = new EventEmitter();

  ngOnInit() {}
  ngOnChanges() {
    if (this.showModel) {
      if (JSON.stringify(this.editIntentTableData)!=='{}') {
        this.defaultParams=this.editIntentTableData
        this.listOfData=this.editIntentTableData['intentExpectations']
      }
    }
	}

  handleCancel(): void {
    this.showModel = false;
    this.clearIntentData()
    this.modalOpreation.emit({ "cancel": true });
  }
  handleOk(): void {
    if(JSON.stringify(this.editIntentTableData)==='{}'){
      this.defaultParams['intentId']=this.Util.getUuid()
      this.createIntentInstance()
    }else{
      this.editIntentInstanceData()
    }
    this.clearIntentData()
  }
  clearIntentData(): void{
    this.defaultParams = {
      intentId:'',
      intentName:'',
      intentExpectations:[
        {
          expectationId:'',
          expectationName:'',
          expectationType:'',
          expectationObject:{
            objectType:'',
            objectInstance:''
          },
          expectationTargets:[
            {
              targetId:'',
              targetName:'',
              targetCondition:{
                conditionId:'',
                conditionName:'',
                operator:'',
                conditionValue:'',
                conditionList:null
              }
            }
          ]
        }
      ]
    };
    this.listOfData=[]
  }

  inputIntentExpectationShow(): void {
    this.intentExpectationShow = true;
  }
  inputIntentExpectationClose($event: any): void {
    this.intentExpectationShow = false;
    this.editExpectationTableList={}
    if ($event.cancel) {
        return;
    }
    if(this.currentIndex>-1){
      this.listOfData[this.currentIndex]=$event.param
      this.currentIndex=-1
    }else{
      this.listOfData.push($event.param)
    }
    this.defaultParams['intentExpectations']=this.listOfData
  }
  editExpectationList(data,i): void {
    this.editExpectationTableList=JSON.parse(JSON.stringify(data))
    this.currentIndex=i
    this.intentExpectationShow = true
  }
  deleteExpectationList(i): void{
    this.listOfData.splice(i,1)
  }

  createIntentInstance(): void {
    this.myhttp.createIntentManagement({
      ...this.defaultParams
    }).subscribe(
      (response) => {
        this.showModel = false;
        this.modalOpreation.emit({ "cancel": false });
        if(response.result_header.result_code===200){
          this.message.success('Created successfully');
        }else{
          this.message.error(response.result_header.result_message);
        }
      },
      (err) => {
        this.showModel = false;
        this.message.error('Created failed');
      }
    )
  }
  editIntentInstanceData(): void {
    let id = this.defaultParams['intentId'];
    let obj = this.defaultParams;
    this.myhttp.updateIntentManagementData(id,obj).subscribe(
      (response) => {
        this.showModel = false;
        this.modalOpreation.emit({ "cancel": false});
        if(response.result_header.result_code===200){
          this.message.success('Modification succeeded');
        }else{
          this.message.error(response.result_header.result_message);
        }
      },
      (err) => {
        this.showModel = false;
        this.message.error('upload fail');
      }
    )
  }
}