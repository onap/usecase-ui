import { Component, OnInit } from '@angular/core';
import {NzModalService} from "ng-zorro-antd";
import { SlicingBusinessModelComponent } from '../../slicing-business-management/slicing-business-model/slicing-business-model.component';
@Component({
  selector: 'app-nsi-model',
  templateUrl: './nsi-model.component.html',
  styleUrls: ['./nsi-model.component.less']
})
export class NsiModelComponent implements OnInit {

    constructor(
        private modalService: NzModalService
    ) {
    }

  ngOnInit() {
  }
    button(){
        this.modalService.create({nzContent:SlicingBusinessModelComponent});
        console.log(2222)
    }
}
