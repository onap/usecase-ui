import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { SSE } from "sse";

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.less']
})
export class RobotComponent implements OnInit {

  question: string;
  communicationMessage: string;
  chatHistory: { question: string, answer: string }[] = [];
  apiUrl = '/api/usecaseui-llm-adaptation/v1/stream';

  constructor(
  private http: HttpClient,
  private message: NzMessageService
  ) { }
  ngOnInit() {}

   submitQuestion() {
    var source = new SSE(this.apiUrl,{headers: {'Content-Type': 'text/plain'},payload: this.question,method:'POST'});
    var lin = this.question;
    const length = this.chatHistory.length;
    source.addEventListener('message',(event)=>{
        let newData = event.data.replace(/\\x0A/g,'\n');
        const lengthNew = this.chatHistory.length;
        if(length==lengthNew){
            this.chatHistory.push({question:lin,answer:newData});
        } else {
            this.chatHistory[lengthNew-1].answer = newData;
        }
    });
    this.question = '';
  }
}
