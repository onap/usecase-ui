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
        //mock Currently tuned api interface
        customers: this.baseUrl + "/uui-lcm/customers", /* get or delete */
        CustomersPir: this.baseUrl + "/uui-lcm/serviceNumByCustomer", /* get */
        serviceType: this.baseUrl + "/uui-lcm/customers/*_*/service-subscriptions", /* get */
        CustomersColumn: this.baseUrl + "/uui-lcm/serviceNumByServiceType/" + "*_*", /* get */
        //mock Currently unadjustable api interface
        deleteCustomer: this.baseUrl + "/uui-lcm/customers", /* delete */
        createCustomer: this.baseUrl + "/uui-lcm/customers/", /* put */
        getCustomerresourceVersion: this.baseUrl + "/uui-lcm/customers/*_*", /* get */

        createServiceType: this.baseUrl + "/uui-lcm/customers/*_*/service-subscriptions/*+*", /* put */
        getServiceTypeResourceVersion: this.baseUrl + "/uui-lcm/customers/*_*/service-subscriptions/*+*", /* get */
        deleteServiceType: this.baseUrl + "/uui-lcm/customers/*_*/service-subscriptions/*+*", /* delete */
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
    deleteSelectCustomer(paramsObj) {
        let url = this.url.deleteCustomer;
        let params = new HttpParams({ fromObject: paramsObj });
        return this.http.delete(url, { params });
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
    deleteSelectServiceType(paramsObj) {
        let customerId = paramsObj.customerId.id,
            ServiceType = paramsObj.ServiceType,
            version = {
                "resourceVersion": paramsObj.version
            };
        let url = this.url.deleteServiceType.replace("*_*", customerId).replace("*+*", ServiceType);
        let params = new HttpParams({ fromObject: version });
        return this.http.delete(url, { params });
    }
}
