import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.less']
})
export class RobotComponent implements OnInit {

  question: string;
  communicationMessage: string;
  chatHistory: { question: string, answer: string }[] = [];
  apiUrl = '/api/usecaseui-llm-adaptation/v1/getHelper';

  constructor(
  private http: HttpClient,
  private message: NzMessageService
  ) { }
  ngOnInit() {}

   submitQuestion() {
    this.http.post<any>(this.apiUrl,this.question,{ responseType: 'text' as 'json'}).subscribe((data) => {
       if(data==''){
          this.chatHistory.push({ question: this.question, answer: 'network error' });
       }else{
        this.chatHistory.push({ question: this.question, answer: data });
       }
        this.question = '';
      }, error => {
        this.message.error('error');
      });
  }
}
