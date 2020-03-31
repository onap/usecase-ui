import { Component, OnInit } from '@angular/core';
import { Network, Node, Edge } from 'vis';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../../../../datainterface';
import { getLocaleDateFormat } from '@angular/common';
@Component({
  selector: 'app-monitor-service',
  templateUrl: './monitor-service.component.html',
  styleUrls: ['./monitor-service.component.less']
})
export class MonitorServiceComponent implements OnInit {

  selectedSubscriptionType: string = "";
  serviceSubscriptionList = [] as Array<any>;
  selectedServiceInstance: string = "" ;
  serviceInstanceList = [] as Array<any>;

  selectedTopology:string = 'i18nTextDefine_serviceTopology';
  baseUrl = baseUrl.baseUrl

  title = 'Network';
    public nodes: Node;
    public edges: Edge;
    public network: Network;
    public serviceList: any;
    public vpnBindingList:any;
    public tempNode: any;
    public tempEdge: any;
    public selectedNode: any;
    public selectedNodeIds: any;
    public x: any;
    public abc = [];
    container: any;
    isdisabled:boolean = true;
    serviceTopologyList:any = [
      {
        topologyType:"i18nTextDefine_serviceTopology",
      },
      {
        topologyType:"i18nTextDefine_resourceTopology",
      }
    ];
  
    
    networkOptions = {
      layout: { 
          randomSeed: 15
      },
      nodes: {
          borderWidth: 13,
          size: 30,
          color: {
              border: '#54bd55',
              background: '#666666'
          },
          font: { color: '#eeeeee' }
      },
      edges: {
          color: 'lightgray',
      },

      interaction: {
          tooltipDelay: 200,
          hideEdgesOnDrag: true,
          navigationButtons: false,
          keyboard: true,
          hover: true
      },
    };

  constructor(private http: HttpClient) { }

  intervalData: any;
  returnResponse: boolean = true;

  onBack(){
     if(this.serviceList.length > 0) {
      this.refreshData("");
     } else {
       this.getData("");
     }
     this.isdisabled = true;
  };

   //Get SubscriptionType
   getSubscribeTypes() {
    this.serviceList = [];
    this.vpnBindingList = [];
    this.isdisabled = true;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    let url = this.baseUrl + "/uui-lcm/customers/service-subscriptions";
    this.http.get<any>(url, httpOptions).subscribe((data) => {
      this.serviceSubscriptionList = data.subscriptions;
    }, (err) => {
      console.log(err);
    });
  }

  //Get subscription instanceID by calling With Subscription Type
  getServiceInstanceList(subscriptionType) {
    this.serviceList = [];
    this.vpnBindingList = [];
    this.isdisabled = true;
    this.serviceInstanceList = [];
    this.selectedServiceInstance="";
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    let url = this.baseUrl + "/uui-lcm/Sotnservices/ServiceInstances/" + subscriptionType;
    this.http.get<any>(url,httpOptions).subscribe((data) => {
      this.serviceInstanceList = data.serviceInstanceList; 
    }, (err) => {
      console.log(err);
    });    
  }

  getTopologyInfo (topo) {
    this.selectedTopology = topo;
    this.getData("");
    this.refreshData("");
  }
  //Get subscription instanceID by calling With Subscription Type
  ngOnInit() {
      this.container = document.getElementById('mynetwork');
      this.getSubscribeTypes();
  }

  refreshData(data) {
      const com = this
      var id ;
      var data1 = {
          nodes: data.nodes,
          edges: data.edges
      };
      var network = new Network(this.container, data1, this.networkOptions);
      network.on('doubleClick', function (selection) {
           var selectedvpnid = selection.nodes[0];
          com.getData(selectedvpnid)
          this.selectedNodeIds = selection.nodes[0]; // array of selected node's ids
          var filteredNode = data1.nodes.filter(item => (
              item.id == this.selectedNodeIds
          ));
          var t1 = '<div class="tblDiv">\
          <nz-form-label class="lblCls">Node Information</nz-form-label>\
          <table class="monitor-table">\
              <thead>\
                  <tr>\
                      <th class="monitor-table-td-th ">Specification</th>\
                      <th class="monitor-table-td-th ">Value</th>\
                  </tr>\
              </thead>\
              <tbody>\
          ';
          Object.entries(filteredNode[0].dataNode).forEach(entry => {                
              if( entry[1] !== "null")
              {
                  t1 += '<tr class="popup-table-row">\
                      <td class="monitor-table-td-th  ">'+ entry[0] + ':</td>\
                      <td class="monitor-table-td-th   ">'+ entry[1] + '</td>\
                  </tr>\
                  ';
              }    
          });
          t1 += '</tbody>\
          </table>\
          </div>\
          ';
          document.getElementById('nodeDetails').innerHTML = t1;
      });
      network.on("afterDrawing", function (this) {
          network.fit();
      });
  }

  getData (vpnid){
    var comp = this;
    let url = "";
    if(vpnid != "" ) {
      if(this.vpnBindingList.length > 0) {
          this.refreshData(this.vpnBindingList)
        } else {
        url = this.baseUrl+'/uui-lcm/Sotnservices/vpnbindingTopology/service/service-subscriptions/service-subscription/'+this.selectedSubscriptionType.toLowerCase()+'/service-instances/service-instance/'+this.selectedServiceInstance+'/vpn-informations/vpn-information/'+ vpnid;
      }
    } else {
      if(this.serviceList.length > 0 && vpnid == "") {
        this.refreshData(this.serviceList);
      } else {
        url = this.baseUrl+'/uui-lcm/Sotnservices/serviceTopology/service/service-subscriptions/service-subscription/'+this.selectedSubscriptionType.toLowerCase()+'/service-instances/service-instance/'+this.selectedServiceInstance;
      }
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.http.get<any>(url, httpOptions).subscribe((data) => {
      if(vpnid == "") {
        this.serviceList = data;
      } else {
        this.vpnBindingList = data;
        this.isdisabled = false;
    }
    comp.refreshData(data);
  }, (err) => {
        console.log(err);
    });
  }

  // Getting sitedata Based On Type and ID
  getSelectedsubscriptionInfo() {       
      this.getData("");
      if (this.intervalData) {
          clearInterval(this.intervalData);
      }        
  }

  
  ngOnDestroy() {
      console.log('clear interval');
      if (this.intervalData) {
          clearInterval(this.intervalData);
      }

  }

  ngOnDelete() {
      console.log('clear interval');
      if (this.intervalData) {
          clearInterval(this.intervalData);
      }
  }

}
