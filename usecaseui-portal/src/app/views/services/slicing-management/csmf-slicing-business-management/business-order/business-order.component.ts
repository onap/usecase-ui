import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMUNICATION_FORM_ITEMS} from "../../../../../../constants/constants";
@Component({
  selector: 'app-business-order',
  templateUrl: './business-order.component.html',
  styleUrls: ['./business-order.component.less']
})
export class BusinessOrderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
    @Input() showModel: boolean;
    @Output() cancel = new EventEmitter<boolean>();

    handleCancel() {
        this.showModel = false;
        this.cancel.emit(this.showModel)
    }
}
