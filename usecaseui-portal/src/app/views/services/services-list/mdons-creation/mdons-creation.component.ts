import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ServiceListService } from '../../../../core/services/serviceList.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import * as d3 from 'd3';

@Component({
  selector: 'app-mdons-creation',
  templateUrl: './mdons-creation.component.html',
  styleUrls: ['./mdons-creation.component.less']
})
export class MdonsCreationComponent implements OnInit {
  mdons_creation_form: FormGroup;

  uniList= [];
  uniIdSelected = { id: null };
  enniList= [];
  enniIdSelected = { id: null };
  templateParameters = {
    invariantUUID: "",
    uuid: "",
    name: "",
    type: "",
    version: "",
    description: "",
    category: "",
    subcategory: "",
    customizationUuid: "",
    inputs: [],
    nestedTemplates: []
  };

  // mdons requstbody
  service = {
    name: "", // <== service instance name
    description: "",
    serviceInvariantUuid: "",
    serviceUuid: "", // uuid ??
    globalSubscriberId: "",   // "customer.id",
    serviceType: "",    // "serviceType.value",
    parameters: {
      locationConstraints: [

      ],
      resources: [],
      requestInputs: {
            name:"",
            customer:"",
            service_provider:"",
            due_date:"",
            end_date:"",
            uni_id:"",
            enni_id:""
      }
    }
  }

  mdonsModelShow : boolean = false;
  constructor(private myhttp: ServiceListService,private fb: FormBuilder) {

    
   }
  @Input() createParams;
  @Input() mdons_temParametersContent;
  @Output() mdonsCloseCreate = new EventEmitter();

  ngOnInit() {
    this.getalluni();
    this.getallenni();
    this.templateParameters=this.mdons_temParametersContent;
    this.mdonsModelShow = true;
    this.mdons_creation_form = this.fb.group({});
    this.buildFormArrayOfGroupsFromArr();
    console.log("Controls "+this.mdons_creation_form.controls['terms'])
  }

  buildFormArrayOfGroupsFromArr() {
    for(let i of this.templateParameters.inputs){
      if(i.isRequired === "true" && !(i.name.includes('uni_id') || i.name.includes('enni_id'))){
      this.mdons_creation_form.addControl(i.name, this.fb.control('', [Validators.required]))
      } else {
        this.mdons_creation_form.addControl(i.name, this.fb.control('')) 
      }
    }
  }

  getalluni() {
    this.myhttp.getAllNI("UNI")
        .subscribe((data) => {
            this.uniList = data.map(item => ({id: item }) );
            if(data.length !== 0){
                this.uniIdSelected = this.uniList[0];
            }
        })
}

getallenni() {
  this.myhttp.getAllNI("NNI")
      .subscribe((data) => {
          this.enniList = data.map(item => ({id: item }) );
          if(data.length !== 0){
              this.enniIdSelected = this.enniList[0];
          }
      })
}

chooseUni(item = this.uniIdSelected){
  if(this.uniIdSelected !== item) this.uniIdSelected = item;
}

chooseEnni(item = this.enniIdSelected){
  if(this.enniIdSelected !== item) this.enniIdSelected = item;
}

  goback() {
    this.mdonsCloseCreate.emit();
  }



  createService() {
    if (this.mdons_creation_form.invalid) {
      return;
    } else {
    this.service.serviceInvariantUuid = this.templateParameters.invariantUUID;
    this.service.name = this.templateParameters.name;
    this.service.description = this.templateParameters.description;
      this.service.serviceUuid = this.templateParameters.uuid;
      this.service.globalSubscriberId = this.createParams.commonParams.customer.id;
      this.service.serviceType = this.createParams.commonParams.serviceType.name;

      this.templateParameters.inputs.forEach((ipnut) => {
        this.service.parameters.requestInputs[ipnut.name] = ipnut.value == undefined ? ipnut.defaultValue : ipnut.value;
        if(ipnut.name.includes('uni_id')) {
          this.service.parameters.requestInputs[ipnut.name] = this.uniIdSelected.id == undefined ? ipnut.defaultValue : this.uniIdSelected.id;
        }
        if(ipnut.name.includes('enni_id')) {
          this.service.parameters.requestInputs[ipnut.name] = this.enniIdSelected.id == undefined ? ipnut.defaultValue : this.enniIdSelected.id;
        }
        if(ipnut.name==='name') {
          this.service.name = ipnut.value == undefined ? ipnut.defaultValue : ipnut.value;
        } 
      })

      console.log(this.service)
      this.mdonsCloseCreate.emit({ service: this.service });
    }
  }

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  };



}