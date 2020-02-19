import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ServiceListService } from '../../../../core/services/serviceList.service';

@Component({
  selector: 'app-mdons-detail',
  templateUrl: './mdons-detail.component.html',
  styleUrls: ['./mdons-detail.component.less']
})
export class MdonsDetailComponent implements OnInit {

  constructor(private myhttp: ServiceListService) { }

  @Input() detailParams;
  @Output() closeDetail = new EventEmitter();
  serviceInstanceName: any;
  serviceType: any;
  input_parameters: any;
  e2e_requestInputs: any;

  service = {
    name: "",
    description: "",
  };

  getKeys(item) {
    return Object.keys(item);
  }

  ngOnInit() {

    console.log(this.detailParams);
    this.serviceInstanceName = this.detailParams['serviceDomain'] || this.detailParams["nsName"];
    this.input_parameters = JSON.parse(this.detailParams['input-parameters']);
      console.log(this.input_parameters);
    this.service = {
      name: this.input_parameters.service.name,
        description: this.input_parameters.service.description,
    };   
    if (this.input_parameters.service.parameters.requestInputs != undefined && Object.keys(this.input_parameters.service.parameters.requestInputs).length > 0) {
      this.e2e_requestInputs = this.input_parameters.service.parameters.requestInputs;
    }
  }

  goback() {
    this.closeDetail.emit();
  }

  

}