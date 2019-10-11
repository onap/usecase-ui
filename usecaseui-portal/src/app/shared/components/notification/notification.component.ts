import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less']
})
export class NotificationComponent implements OnInit {
  @ViewChild('notificationModel')notificationModel: any;

  notificationAttributes: object = null;

  constructor(private notification: NzNotificationService) { }

  ngOnInit() {
  }

  setNotification({ title, imgPath, action, status, name }):void{
      this.notificationAttributes = { title, imgPath, action, status, name }
  }
  notificationSuccess(title: string, action: string, name: string): void {
    this.notification.remove()
    this.setNotification({ title, imgPath: "assets/images/execute-success.png", action, status: 'Success', name })
    this.notification.template(this.notificationModel);
  }
  notificationFailed(title: string, action: string, name: string): void {
    this.notification.remove()
    this.setNotification({ title, imgPath: "assets/images/execute-faild.png", action, status: 'Failed', name })
    this.notification.template(this.notificationModel)
  }

}
