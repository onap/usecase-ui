import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../models/dataInterface';


@Injectable()
export class ManagemencsService {

    constructor(private http: HttpClient) { }
    baseUrl = baseUrl.baseUrl;

    /* line up */
    url = {
        // The following APIs are optimizable
        customers: this.baseUrl + "/uui-lcm/customers", /* get */
        CustomersPir: this.baseUrl + "/uui-lcm/serviceNumByCustomer", /* get */
        deleteCustomer: this.baseUrl + "/uui-lcm/customers?customerId=*_*&resourceVersion=*+*", /* delete */
        // The following APIs are not optimizable
        serviceType: this.baseUrl + "/uui-lcm/customers/" + "*_*" + "/service-subscriptions", /* get */
        CustomersColumn: this.baseUrl + "/uui-lcm/serviceNumByServiceType/" + "*_*", /* get */
        createCustomer: this.baseUrl + "/uui-lcm/customers/", /* put */
        createServiceType: this.baseUrl + "/uui-lcm/customers/*_*/service-subscriptions/*+*", /* put */
        getCustomerresourceVersion: this.baseUrl + "/uui-lcm/customers/*_*", /* put */
        getServiceTypeResourceVersion: this.baseUrl + "/uui-lcm/customers/*_*/service-subscriptions/*+*",
        deleteServiceType: this.baseUrl + "/uui-lcm/customers/*_*/service-subscriptions/*+*?resourceVersion=*@*  ",
    };

    //The following APIs are optimizable ----------------------------------

    // Get all customers
    getAllCustomers() {
        return this.http.get<any>(this.url.customers);
    }
    // create New Customer
    createCustomer(customer, createParams) {
        let url = this.url.createCustomer + customer;
        return this.http.put(url, createParams);
    }
    // delete SelectCustomer
    deleteSelectCustomer(params) {
        let customerId = params.customerId,
            version = params.version;
        let url = this.url.deleteCustomer.replace("*_*", customerId).replace("*+*", version);
        return this.http.delete(url);
    }

    //The following APIs are not optimizable ---------------------------------

    // get all servicetype
    getServiceTypes(customer) {
        let url = this.url.serviceType.replace("*_*", customer.id);
        return this.http.get<any>(url);
    }
    // get Customer Pir
    getCustomersPie() {
        return this.http.get<any>(this.url.CustomersPir);
    }
    // get Customer ber
    getCustomersColumn(customer) {
        let url = this.url.CustomersColumn.replace("*_*", customer.id);
        return this.http.get<any>(url);
    }
    // create ServiceType
    createServiceType(createParams) {
        let customerId = createParams.customer.id,
            ServiceType = createParams.ServiceType;
        let url = this.url.createServiceType.replace("*_*", customerId).replace("*+*", ServiceType);
        return this.http.put(url, createParams);//online
    }
    // Get delete Customer Version
    getdeleteCustomerVersion(thisdeleteCustomer) {
        let url = this.url.getCustomerresourceVersion.replace("*_*", thisdeleteCustomer.id);
        return this.http.get(url);
    }
    // Get delete ServiceType Version
    getdeleteServiceTypeVersion(params) {
        let customerId = params.customerId.id,
            ServiceType = params.ServiceType;
        let url = this.url.getServiceTypeResourceVersion.replace("*_*", customerId).replace("*+*", ServiceType);
        return this.http.get(url);
    }
    // delete Select ServiceType
    deleteSelectServiceType(params) {
        let customerId = params.customerId.id,
            ServiceType = params.ServiceType,
            version = params.version;
        let url = this.url.deleteServiceType.replace("*_*", customerId).replace("*+*", ServiceType).replace("*@*", version);
        return this.http.delete(url);
    }
}
