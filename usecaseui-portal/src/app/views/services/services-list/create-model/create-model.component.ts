import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { ServiceListService } from '../../../../core/services/serviceList.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.less'],
})
export class CreateModelComponent implements OnInit { 
  @Input()isVisible: boolean;
  @Input()customerList;
  @Input()serviceTypeList;
  @Input()customerSelected;
  @Input()serviceTypeSelected;
  
  @Output() cancel = new EventEmitter<boolean>();
  @Output() createdModalShow = new EventEmitter<any>();

  serviceTypes: any[];
  currentCustomer: any;
  currentServiceType: any; 
  templateTypeSelected:string = "CCVPN";
  templates: any[] = [];
  currentTemplate: object = { name: null };
  orchestratorList: any[] = [];
  orchestratorSelected: object = { name: null, id: null };
  isSol005Interface: boolean = false;
  temParametersTips: boolean = false;
  createData: Object = {};
  loadingAnimateShow: boolean = false;

  constructor(
      private http: ServiceListService,
      private msg: NzMessageService
  ) {}

  ngOnInit() {
    this.serviceTypes = this.serviceTypeList;
    this.currentCustomer = JSON.parse(JSON.stringify(this.customerSelected));
    this.currentServiceType = JSON.parse(JSON.stringify(this.serviceTypeSelected));
    this.getAlltemplates();
  }

  getServiceType() {
    this.http.getServiceTypes(this.currentCustomer)
    .subscribe((data) => {
      this.serviceTypes = data.map((item) => {
        return { name: item["service-type"] }
      });
      this.currentServiceType = this.serviceTypes[0]
    })
  } 
  
  getAlltemplates() {
    this.http.getAllServiceTemplates(this.templateTypeSelected)
      .subscribe((data) => {
        if(data.length!==0){
            this.templates = data;
            if (this.templateTypeSelected == "Network Service") {
                this.templates = data.filter((d) => {
                    return typeof d.packageInfo.csarName == "string";
                }).map((item) => {
                    let cName = item.packageInfo.csarName.split("/").reverse()[0];
                    return { name: cName, id: item.csarId, packageInfo: item.packageInfo }
                });
            }
            this.currentTemplate = this.templates[0];
        }
      }, (err) => {
        this.msg.error(err);
      })
  }

  getallOrchestrators() {
    this.http.getAllOrchestrators()
      .subscribe((data) => {
        if(data.length > 0){
            this.orchestratorList = data.map((item) => {
                return { name: item["name"], id: item["name"] }
            });
            this.orchestratorSelected = this.orchestratorList[0];
        }
    })
  }

  handleCancel(): void {
    this.isVisible = false;
    this.cancel.emit(false);
    this.loadingAnimateShow = false;
  }

  customerChange(id): void {
    this.currentCustomer = this.customerList.find(item=>{
        return item.id === id
    });
    this.getServiceType();
  }

  choseTemplateType() {
    if(this.templateTypeSelected === 'E2E Service'){
      this.getallOrchestrators();
    }
    this.getAlltemplates();
  }

  handleOk(): void {
      if(this.templates.length === 0){
          this.msg.warning('Template is required.');
          return
      }
    if (this.templateTypeSelected === "SOTN" || this.templateTypeSelected === "CCVPN" || this.templateTypeSelected === "MDONS") {
        this.createData = {
            commonParams: {
              customer: this.currentCustomer,
              serviceType: this.currentServiceType,
              templateType: this.templateTypeSelected
            },
            template: this.currentTemplate
        };
    } else if (this.templateTypeSelected === "E2E Service" || this.templateTypeSelected === "Network Service") {
        this.createData = {
            commonParams: {
                customer: this.currentCustomer,
                serviceType: this.currentServiceType,
                templateType: this.templateTypeSelected
            },
            template: this.currentTemplate,
            orchestrator: this.orchestratorSelected,
            isSol005Interface: this.isSol005Interface
        };
    }
    this.getTemParameters();
  }
  
  getTemParameters() {
    let chosedtemplates = this.createData["template"];
    let types = this.createData["commonParams"].templateType;
    if (types == "E2E Service") {
      types = "e2e";
    } else if (types == "Network Service") {
      types = "ns";
    }
    this.loadingAnimateShow = true;
    this.http.getTemplateParameters(types, chosedtemplates)
        .subscribe((data) => {
          this.loadingAnimateShow = false;
          if (!data || !data.status) {
            this.temParametersTips = true;
            this.isVisible = true;
            this.msg.error('Back end data format error')
          }
          else if (data.status == "FAILED") {
            this.temParametersTips = true;
            this.isVisible = true;
          } else {
            this.cancel.emit(false);
            this.temParametersTips = false;
            this.createdModalShow.emit({templateType: this.templateTypeSelected, data, createData: this.createData})
          }
        })
  }
}