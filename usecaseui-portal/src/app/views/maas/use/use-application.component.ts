import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SSE } from "sse.js";
import { ActivatedRoute } from '@angular/router';
import { MaasApi } from '@src/app/api/maas.api';
import { TranslateService } from '@ngx-translate/core';
import { MaasService } from '../maas-service.service';
export type StatusEnum = 'typing' | 'finished';
export type Chat = { question: string, answer: string, questionId: string, status: StatusEnum };
@Component({
  selector: 'app-use-application',
  templateUrl: './use-application.component.html',
  styleUrls: ['./use-application.component.less']
})
export class UseApplicationComponent implements OnInit {
  question: string;
  communicationMessage: string;
  chatHistory: Chat[] = [];
  apiUrl = '/api/usecaseui-llm-adaptation/v1/application/chat';
  queryParams: { id?: string; name?: string } = {};
  selectedName: string | null = null;
  options: Array<{ nzValue: string, nzLabel: string }> = [];
  send = this.translate.instant('maas.send');
  private currentSSE: SSE | null = null;
  isGeneratingAnswer: boolean = false;
  stopGenerating = this.translate.instant('maas.stopGenerating');
  questionId = '';
  constructor(
    private message: NzMessageService,
    private route: ActivatedRoute,
    private myhttp: MaasApi,
    private translate: TranslateService,
    private maasService: MaasService
  ) { }

  async ngOnInit() {
    await this.fetchAllApplication();
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
      this.selectedName = this.queryParams.id || this.selectedName;
    });
  }
  
  close() {
    if (this.currentSSE) {
      this.currentSSE.close();
    }
  }

  doAction() {
    if (this.isGeneratingAnswer) {
      this.close();
      this.chatHistory.forEach(item => {item.status = 'finished'});
      this.isGeneratingAnswer = false;
    } else {
      this.submitQuestion();
    }
  }

  submitQuestion() {
    if (!this.question) {
      return;
    }
    this.isGeneratingAnswer = true;
    const chatParam = {
      applicationId: this.selectedName,
      question: this.question,
      questionId: this.maasService.generateUniqueId()
    };
    this.currentSSE = new SSE(this.apiUrl, { headers: { 'Content-Type': 'application/json' }, payload: JSON.stringify(chatParam), method: 'POST' });
    const questionId = chatParam.questionId;
    this.chatHistory.push({ question: chatParam.question, questionId: chatParam.questionId, answer: '', status: 'typing' });
    this.currentSSE.addEventListener('message', (event) => {
      const chat = this.chatHistory.find(chatItem => chatItem.questionId === questionId);
      if (chat) {
        if (['[DONE]', 'Network Error'].includes(event.data)) {
          chat.status = 'finished';
          this.isGeneratingAnswer = false;
          if (event.data === 'Network Error') {
            this.updateAnswer(event, chat);
          }
          this.close();
        } else {
          this.updateAnswer(event, chat);
        }
      }
    });
    this.currentSSE.addEventListener('error', () => {
      this.currentSSE = null;
      this.isGeneratingAnswer = false;
    });
    this.currentSSE.addEventListener('close', () => {
      this.currentSSE = null;
      this.isGeneratingAnswer = false;
    });
    this.question = '';
  }

  updateAnswer(event: any, chat: Chat): void {
    chat.answer += event.data.replace(/__SPACE__/g, ' ');
  }

  async fetchAllApplication(): Promise<void> {
    try {
      const data = await this.myhttp.getAllApplication().toPromise();
      this.options = data.result_body.map(item => ({
        nzValue: item.applicationId,
        nzLabel: item.applicationName
      }));
      this.selectedName = this.options.length > 0 ? this.options[0].nzValue : '';
    } catch {
      this.message.error('Failed to obtain intent data');
    }
  }

  async copy(content: string): Promise<void> {
    try {
      await (navigator as any).clipboard.writeText(content);
      this.message.success(this.translate.instant('maas.copy_to_clipboard'));
    } catch (err) {
      console.error(this.translate.instant('maas.copy_failed') + ': ', err);
    }
  }

  deleteQuestion(questionId: string): void {
    this.chatHistory = this.chatHistory.filter(item => item.questionId !== questionId);
  }
}
