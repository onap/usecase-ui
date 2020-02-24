import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,  
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  styleUrls: ['./order-service.component.less']
})
export class OrderServiceComponent implements OnInit {

  validateForm: FormGroup;
  validateForm1: FormGroup;
  validateForm2: FormGroup;
  l2vpn:object = {};
  siteData:object = {};
  tipMsg: String = "serviceCreationInitiated";
  displayMsg:boolean = false;
  displayMsg2:boolean = false;
  buttonDisabled:boolean = false;
  intervalData:any;
  baseUrl:string = '/api/usecaseui-server/v1';
  expandDataSet = [
    { rowIdx: 1, name: 'Service', expand: true },
    { rowIdx: 2, name: 'VPN', expand: true },
    { rowIdx: 3, name: 'UNI', expand: true }
  ];
  uni = {
    sotnuni_cVLAN:"asdf",
    sotnuni_tpId:"asdf"
  };
  sotnUni = [
    {
      sotnuni_cVLAN:"asdf",
      sotnuni_tpId:"saf"
    }
  ];

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
    // this.validateForm1 = this.fb.group({
    //   l2vpn_name:[null, [Validators.required]],
    //   l2vpn_dualLink:[null, [Validators.required]],
    //   l2vpn_description:[null, [Validators.required]],
    //   l2vpn_SLS:[null, [Validators.required]],
    //   l2vpn_COS:[null, [Validators.required]],
    //   l2vpn_tenantId:[null, [Validators.required]],
    //   l2vpn_vpnType:[null, [Validators.required]],
    //   l2vpn_cbs:[null, [Validators.required]],
    //   l2vpn_ebs:[null, [Validators.required]],
    //   l2vpn_colorAware:[null, [Validators.required]],
    //   l2vpn_reroute:[null, [Validators.required]],
    //   l2vpn_couplingFlag:[null, [Validators.required]],
    //   l2vpn_cir:[null, [Validators.required]],
    //   l2vpn_eir:[null, [Validators.required]],
    //   l2vpn_startTime:[null, [Validators.required]],
    //   l2vpn_endTime:[null, [Validators.required]],
    // });
    // this.validateForm2 = this.fb.group({
    //   sotnuni_cVLAN:[null, [Validators.required]],
    //   sotnuni_tpId:[null, [Validators.required]],
    // });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        }
    return true;
  }

  addUNI () {
    this.sotnUni.push(this.uni);
    // this.uni = {};
  }

  selectOrderSiteData(): void {
    if (!this.validateVpnAndUni() ||
      !this.validateServices() ) {
      this.displayMsg = true;
      this.message.error("Please fill all mandatory fields");
      var comp = this;
      setTimeout(function () {
        comp.displayMsg = false;
      }, 5000);
    } else {
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
    let url1 = this.baseUrl + '/uui-lcm/Sotnservices';
    // this.http.post<any>(url1, body, httpOptions).subscribe((data) => { 
    //   let comp = this;
    //   this.message.info('Instantiation In Progress');
    //   comp.displayMsg2 = true;
    //   this.intervalData = setInterval(() => {
    //     let url2 = this.baseUrl + "/uui-lcm/Sotnservices/serviceStatus/service-instance/" + data.service.serviceId;
    //     this.http.get<any>(url2, {}).subscribe((data) => {
    //       if (data.status == "1") {
    //         clearInterval(comp.intervalData);
    //         comp.displayMsg2 = true;
    //         comp.message.success('Service Created');
    //         comp.goToPage();
    //       }
    //       else {
    //         comp.message.info('Instantiation In Progress');
    //         comp.displayMsg2 = true;
    //       }
    //     }, (err) => {
    //       console.log(err);
    //     });
    //   }, 1000);
    // }, (err) => {
    //   console.log(err);
    // });
    setTimeout(() => {
      comp.message.success("Service Created");
      comp.goToPage();
    }, 3000);
  }

  goToPage(): void {
    setTimeout(function () {
      // document.getElementById('manageService').click();
    }, 1000);
  }

}
