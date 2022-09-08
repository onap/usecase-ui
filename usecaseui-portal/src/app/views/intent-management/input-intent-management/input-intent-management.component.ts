import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IntentManagementService } from '../../../core/services/intentManagement.service';
import { Util } from '../../../shared/utils/utils';

@Component({
  selector: 'app-input-intent-management',
  templateUrl: './input-intent-management.component.html',
  styleUrls: ['../intent-management.component.less']
})
export class InputIntentManagementComponent implements OnInit {

  constructor(
    private myhttp: IntentManagementService,
    private Util: Util
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
    this.showModel = false;
    if(JSON.stringify(this.editIntentTableData)==='{}'){
      this.defaultParams['intentId']=this.Util.getUuid()
    }
    this.createIntentInstance()
    this.modalOpreation.emit({ "cancel": false, "param": this.defaultParams });
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
        this.modalOpreation.emit({ "cancel": false });
      },
      (err) => {
        console.log(err);
      }
    )
  }
}