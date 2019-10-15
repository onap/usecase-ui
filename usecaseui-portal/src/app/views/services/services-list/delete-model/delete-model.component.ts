import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-delete-model',
  templateUrl: './delete-model.component.html',
  styleUrls: ['./delete-model.component.less']
})
export class DeleteModelComponent implements OnInit {
  @Input()deleteModalVisible: boolean;
  @Input()thisService;
  @Input()terminationType;
  @Input()loadingAnimateShow;
  @Input()templateDeleteSuccessFaild;
  @Input()gracefulTerminationTimeout;

  @Output() cancel = new EventEmitter<boolean>();
  @Output() deleteModalOK = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

    deleteOk() {
        this.deleteModalVisible = false;
        this.loadingAnimateShow = true;

        if (this.thisService["serviceDomain"] === "Network Service") {
            this.deleteModalOK.emit({
                terminationType: this.terminationType,
                gracefulTerminationTimeout: this.gracefulTerminationTimeout
            })
        } else {
            this.deleteModalOK.emit()
        }
    }
    deleteCancel() {
        this.deleteModalVisible = false;
    }


}
