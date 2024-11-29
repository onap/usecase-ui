import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { SSE } from "sse.js";
import { ActivatedRoute } from '@angular/router';
import { IntentManagementService } from '../../../core/services/intentManagement.service'


@Component({
  selector: 'app-use-application',
  templateUrl: './use-application.component.html',
  styleUrls: ['./use-application.component.less']
})
export class UseApplicationComponent implements OnInit {

  question: string;
  communicationMessage: string;
  chatHistory: { question: string, answer: string }[] = [];
  apiUrl = '/api/usecaseui-llm-adaptation/v1/application/chat';
  queryParams: { id?: string; name?: string } = {};
  selectedName: string | null = null;
  options: any[] = [];

  constructor(
  private http: HttpClient,
  private message: NzMessageService,
  private route: ActivatedRoute,
  private myhttp: IntentManagementService,
  ) { }
  ngOnInit() {
  this.getIntentManagementData();
      this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      console.log(params.id);
      this.selectedName = this.queryParams.id ;
    });
  }

  submitQuestion() {
    const chatParam = {
         applicationId: this.queryParams.id,
         question: this.question
     };
     var source = new SSE(this.apiUrl,{headers: {'Content-Type': 'application/json'},payload: JSON.stringify(chatParam),method:'POST'});
     var lin = this.question;
     const length = this.chatHistory.length;
     source.addEventListener('message',(event)=>{
         const existingEntryIndex = this.chatHistory.findIndex(entry => entry.question === lin);
         console.log(event.data);
         if (existingEntryIndex !== -1) {
             this.chatHistory[existingEntryIndex].answer += event.data.replace(/__SPACE__/g, ' ');
         } else {
             this.chatHistory.push({ question: lin, answer: event.data });
         }
     });
     this.question = '';
   }

  getIntentManagementData():void{
    this.myhttp.getAllApplication()
    .subscribe(
      (data) => {
       this.options = data.result_body.map(item => ({
        nzValue: item.applicationId,
        nzLabel: item.applicationName
      }));

      },
      () => {
        this.message.error('Failed to obtain intent data');
      }
    )
  }
}
