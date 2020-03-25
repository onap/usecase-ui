import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,  
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { baseUrl } from '../../../../datainterface';

@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  styleUrls: ['./order-service.component.less']
})
export class OrderServiceComponent implements OnInit {

  validateForm: FormGroup;
  l2vpn:object = {};
  siteData:object = {};
  buttonDisabled:boolean = false;
  intervalData:any;
  baseUrl = baseUrl.baseUrl
  expandDataSet = [
    { rowIdx: 1, name: 'i18nTextDefine_serviceInformation', expand: true },
    { rowIdx: 2, name: 'i18nTextDefine_vpnInformation', expand: true },
    { rowIdx: 3, name: 'i18nTextDefine_uniInformation', expand: true }
  ];
  uni = {};
  sotnUni = [];
  
  @Output() childEvent = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private http: HttpClient, private message: NzMessageService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name:[null, [Validators.required]],
      description:[null, [Validators.required]],
      l2vpn_name:[null, [Validators.required]],
      l2vpn_dualLink:[null, [Validators.required]],
      l2vpn_description:[null, [Validators.required]],
      l2vpn_SLS:[null, [Validators.required]],
      l2vpn_COS:[null, [Validators.required]],
      l2vpn_tenantId:[null, [Validators.required]],
      l2vpn_vpnType:[null, [Validators.required]],
      l2vpn_cbs:[null, [Validators.required]],
      l2vpn_ebs:[null, [Validators.required]],
      l2vpn_colorAware:[null, [Validators.required]],
      l2vpn_reroute:[null, [Validators.required]],
      l2vpn_couplingFlag:[null, [Validators.required]],
      l2vpn_cir:[null, [Validators.required]],
      l2vpn_eir:[null, [Validators.required]],
      l2vpn_startTime:[null, [Validators.required]],
      l2vpn_endTime:[null, [Validators.required]],
      sotnuni_cVLAN:[null, [Validators.required]],
      sotnuni_tpId:[null, [Validators.required]],
    });
  }

  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        }
    return true;
  }

  addUNI () {
    if(this.uni['sotnuni_cVLAN'] == undefined || this.uni['sotnuni_tpId'] == undefined) {
      this.message.error("Please enter cVLAN & TPID first.");
      return;
    }
    this.sotnUni.push(this.uni);
    this.uni = {};
  }

  deletesotnUni(data) {
    for(let i = 0; i < this.sotnUni.length; i++) {
      if(data.sotnuni_tpId == this.sotnUni[i].sotnuni_tpId) {
        this.sotnUni.splice(i, 1); 
      }
    }
  }

  selectOrderSiteData(): void {
    if (!this.validateVpnAndUni() ||
      !this.validateServices() ) {
      this.message.error("Please fill all mandatory fields");
    } else {
      this.siteData["l2vpn"] = [this.l2vpn];
      this.siteData["sotnUni"] = this.sotnUni;
      this.putnewSotnSiteData()
    }
  }

  validateServices (): boolean {
    if (this.siteData["name"] == null ||
      this.siteData["description"] == null) {
        return false;
    }
    return true;
  }

  validateVpnAndUni (): boolean {
    if (this.l2vpn["l2vpn_COS"] == null ||
      this.l2vpn["l2vpn_dualLink"] == null ||
      this.l2vpn["l2vpn_description"] == null ||
      this.l2vpn["l2vpn_name"] == null ||
      this.l2vpn["l2vpn_tenantId"] == null ||
      this.l2vpn["l2vpn_vpnType"] == null ||
      this.l2vpn["l2vpn_cbs"] == null ||
      this.l2vpn["l2vpn_ebs"] == null ||
      this.l2vpn["l2vpn_colorAware"] == null ||
      this.l2vpn["l2vpn_cir"] == null ||
      this.l2vpn["l2vpn_startTime"] == null ||
      this.l2vpn["l2vpn_endTime"] == null ||
      this.l2vpn["l2vpn_eir"] == null ||
      this.l2vpn["l2vpn_SLS"] == null ||
      this.sotnUni.length == 0 ||
      this.l2vpn["l2vpn_reroute"] == null) {
        return false;
    }
    // for (const i in this.validateForm.controls) {
    //   this.validateForm.controls[i].markAsDirty();
    //   this.validateForm.controls[i].updateValueAndValidity();
    // }
    return true;
  }

  putnewSotnSiteData() {
    console.log("order service data===>", this.siteData)
    let comp = this;
    this.message.info('Instantiation In Progress');
    this.buttonDisabled = true;
    let body = JSON.stringify(this.siteData);
    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type': 'application/json',
      })
    };
    
    let url1 = this.baseUrl + '/uui-lcm/Sotnservices_unni';
    this.http.post<any>(url1, body, httpOptions).subscribe((data) => { 
      let comp = this;
      this.message.info('Instantiation In Progress');
      this.intervalData = setInterval(() => {
        const httpOptions1 = {
          headers: new HttpHeaders({
           'Content-Type': 'application/json',
          })
        };
        let url2 = this.baseUrl + "/uui-lcm/Sotnservices/serviceStatus/service-instance/" + data.service.serviceId;
        this.http.get<any>(url2, httpOptions1).subscribe((data) => {
          if (data.status == "1") {
            clearInterval(comp.intervalData);
            comp.message.success('Service Created');
            comp.goToPage();
          }
          else {
            comp.message.info('Instantiation In Progress');
          }
        }, (err) => {
          console.log(err);
        });
      }, 1000);
    }, (err) => {
      console.log(err);
    });
    setTimeout(() => {
      comp.message.success("Service Created");
      comp.goToPage.call(comp);
    }, 3000);
  }

  goToPage(): void {
    var comb = this;
    setTimeout(function () {
      comb.childEvent.emit();
    }, 1000);
  }

}
