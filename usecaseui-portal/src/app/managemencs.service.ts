import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {baseUrl} from './dataInterface';


@Injectable()
export class ManagemencsService {

  constructor(private http: HttpClient) { }
    baseUrl = baseUrl.baseUrl

   /* location */
    url = {
      customers:this.baseUrl + "/customers/customers_list.json?",
      serviceType:this.baseUrl + "/serviceTypes.json?*_*",
      CustomersPir:this.baseUrl + "/customers/customersber.json?",
      CustomersColumn:this.baseUrl + "/customers/customersber.json?",
      
    }


  /* line up */
    // url = {
    //   customers:this.baseUrl + "/uui-lcm/customers",/* get */
    //   serviceType:this.baseUrl + "/uui-lcm/customers/"+"*_*"+"/service-subscriptions",/* get */
    //   CustomersPir:this.baseUrl + "/uui-lcm/serviceNumByCustomer",/* get */
    //   CustomersColumn:this.baseUrl + "/uui-lcm/serviceNumByServiceType/"+"*_*",/* get */
    // }


    // Get all customers
    getAllCustomers() {
      return this.http.get<any>(this.url.customers);
    }
    // get all servicetype
    getServiceTypes(customer) {
      let url = this.url.serviceType.replace("*_*", customer.id);
      console.log(url)
      return this.http.get<any>(url);
    }
    // get Customer Pir
    getCustomersPie(){
      return this.http.get<any>(this.url.CustomersPir);
    }
    // get Customer ber
    getCustomersColumn(customer){
      let url = this.url.CustomersColumn.replace("*_*", customer.id);
      return this.http.get<any>(url);
    }
}
