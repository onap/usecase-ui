import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less']
})
export class NotificationComponent implements OnInit {
  @ViewChild('notificationModel')notificationModel: any;
  @Input()isServicesList: boolean;
  @Input()parentComponent: string;
  @Input()customerSelected: object;

  notificationAttributes: {
    title: string,
    imgPath: string,
    action: string,
    status: string,
    name: string
  };

  constructor(private notification: NzNotificationService) { }

  ngOnInit() { }

  setNotification({ title, imgPath, action, status, name }):void{
    this.notificationAttributes = { title, imgPath, action, status, name };
  }
  notificationSuccess(title: string, action: string, name: string): void {
    this.notification.remove();
    this.setNotification({ title, imgPath: "assets/images/execute-success.png", action, status: 'Success', name })
    this.notification.template(this.notificationModel);
  }
  notificationFailed(title: string, action: string, name: string): void {
    this.notification.remove();
    this.setNotification({ title, imgPath: "assets/images/execute-faild.png", action, status: 'Failed', name })
    this.notification.template(this.notificationModel)
  }
  notificationStart(title: string, action: string, name: string): void {
    this.notification.remove();
    this.setNotification({ title, imgPath: "assets/images/execute-inproess.png", action , status: 'instance temination is starting', name })
    this.notification.template(this.notificationModel)
  }

}
