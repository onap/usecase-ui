import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {baseUrl} from './dataInterface';


@Injectable()
export class ManagemencsService {

  constructor(private http: HttpClient) { }
    baseUrl = baseUrl.baseUrl;

    /* location */
    // url = {
    //     customers: this.baseUrl + "/customers/customers_list.json",
    //     serviceType: this.baseUrl + "/serviceTypes.json?*_*",
    //     CustomersPir: this.baseUrl + "/customers/customersber.json",
    //     CustomersColumn: this.baseUrl + "/customers/customersber.json?*_*",
    //     createCustomer: this.baseUrl + "/customers/createCustomer.json?",
    //     createServiceType: this.baseUrl + "/customers/createServiceType.json",
    //     getCustomerResourceVersion: this.baseUrl + "/customers/deleteCustomer.json?*_*",
    //     deleteCustomer: this.baseUrl + "/customers/createServiceType.json",
    //     getServiceTypeResourceVersion: this.baseUrl + "/customers/deleteCustomer.json?*_*",
    //     deleteServiceType: this.baseUrl + "/customers/createServiceType.json",
    // };


    /* line up */
    url = {
        customers:this.baseUrl + "/uui-lcm/customers", /* get */
        serviceType:this.baseUrl + "/uui-lcm/customers/"+"*_*"+"/service-subscriptions", /* get */
        CustomersPir:this.baseUrl + "/uui-lcm/serviceNumByCustomer", /* get */
        CustomersColumn:this.baseUrl + "/uui-lcm/serviceNumByServiceType/"+"*_*", /* get */
        createCustomer:this.baseUrl+"/uui-lcm/customers/", /* put */
        createServiceType:this.baseUrl+"/uui-lcm/customers/*_*/service-subscriptions/*+*", /* put */
        getCustomerresourceVersion:this.baseUrl+"/uui-lcm/customers/*_*", /* put */
        deleteCustomer:this.baseUrl+"/uui-lcm/customers?customerId=*_*&resourceVersion=*+*",
        getServiceTypeResourceVersion:this.baseUrl+"/uui-lcm/customers/*_*/service-subscriptions/*+*",
        deleteServiceType:this.baseUrl+"/uui-lcm/customers/*_*/service-subscriptions/*+*?resourceVersion=*@*  ",
    };


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
    // create New Customer
    createCustomer(customer, createParams) {
        let url = this.url.createCustomer + customer;
        // return this.http.get(url, createParams);//location
        return this.http.put(url,createParams);//online
    }

    createServiceType(createParams) {
        let customerId = createParams.customer.id,
            ServiceType = createParams.ServiceType;
        let url = this.url.createServiceType.replace("*_*", customerId).replace("*+*", ServiceType);
        // return this.http.get(url,createParams);//location
        return this.http.put(url, createParams);//online
    }

    getdeleteCustomerVersion(thisdeleteCustomer) {
        let url = this.url.getCustomerresourceVersion.replace("*_*", thisdeleteCustomer.id);
        return this.http.get(url);
    }

    deleteSelectCustomer(params) {
        let customerId = params.customerId,
            version = params.version;
        let url = this.url.deleteCustomer.replace("*_*", customerId).replace("*+*", version);
        return this.http.delete(url);
    }

    getdeleteServiceTypeVersion(params) {
        let customerId = params.customerId.id,
            ServiceType = params.ServiceType;
        let url = this.url.getServiceTypeResourceVersion.replace("*_*", customerId).replace("*+*", ServiceType);
        return this.http.get(url);
    }

    deleteSelectServiceType(params) {
        let customerId = params.customerId.id,
            ServiceType = params.ServiceType,
            version = params.version;
        let url = this.url.deleteServiceType.replace("*_*", customerId).replace("*+*", ServiceType).replace("*@*", version);
        return this.http.delete(url);
    }
}
