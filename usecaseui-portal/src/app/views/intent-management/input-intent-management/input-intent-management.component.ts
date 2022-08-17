import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-input-intent-management',
  templateUrl: './input-intent-management.component.html',
  styleUrls: ['./input-intent-management.component.less']
})
export class InputIntentManagementComponent implements OnInit {

  constructor() {}
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
    createdTime:'2022-7-11 10:40:00'
  };
  pageSize: number = 10;
  intentNameError: boolean = false;
  currentIndex:number = -1;
  intentExpectationShow: boolean = false;
  editExpectationTableList: Object={};

  listOfData: any[] = [];

  @Input() showModel: boolean;
  @Input() editIntentTableData: Object={}
  @Output() modalOpreation = new EventEmitter();

  ngOnInit() {}
  ngOnChanges() {
    if (this.showModel) {
      this.intentNameError=false
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
  
  changeIntentName(): void{
    this.intentNameError=this.defaultParams['intentName']===''
  }
  getUuid() {
    let s = []
    let hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
      let _temp=Math.floor(Math.random() * 0x10)
      s[i] = hexDigits.substring(_temp, _temp + 1)
    }
    s[14] = '4'
    let _temp2=(s[19] & 0x3) | 0x8
    s[19] = hexDigits.substring(_temp2, _temp2 + 1)
    s[8] = s[13] = s[18] = s[23] = '-'
    return s.join('')
  }
  handleOk(): void {
    this.intentNameError=this.defaultParams['intentName']===''
    if(this.intentNameError){
      return
    }
    this.showModel = false;
    if(JSON.stringify(this.editIntentTableData)==='{}'){
      this.defaultParams['intentId']=this.getUuid()
    }
    console.log(this.defaultParams)
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
      ],
      createdTime:'2022-7-11 10:40:00'
    };
    this.listOfData=[]
  }

  inputIntentExpectationShow(): void {
    this.intentExpectationShow = true;
  }
  inputIntentExpectationClose($event: any): void {
    this.intentExpectationShow = false;
    if ($event.cancel) {
        return;
    }
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
}