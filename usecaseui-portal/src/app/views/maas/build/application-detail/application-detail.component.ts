import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../application.type';

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.less']
})
export class ApplicationDetailComponent implements OnInit {
  @Input() showModal: boolean;
  @Input()  applicationDetail: Application;
  @Output() modalOpreation = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  handleCancel(): void {
    this.showModal = false;
    this.modalOpreation.emit();
  }

   handleOk(): void {
    this.showModal = false;
    this.modalOpreation.emit();
  }

}