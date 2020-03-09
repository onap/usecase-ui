import { Component, OnInit } from '@angular/core';
import { Network, Node, Edge } from 'vis';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../../../../datainterface';
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
  serviceTopologyList:any = [
    {
      topologyType:"i18nTextDefine_serviceTopology",
    },
    {
      topologyType:"i18nTextDefine_resourceTopology",
    }
  ];
  baseUrl = baseUrl.baseUrl
  // baseUrl:string = 'http://localhost:8082/api/usecaseui-server/v1';

  title = 'Network';
    public nodes: Node;
    public edges: Edge;
    public network: Network;
    public serviceList: any;
    public tempNode: any;
    public tempEdge: any;
    public selectedNode: any;
    public selectedNodeIds: any;
    public x: any;
    public abc = [];
    container: any;
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
          color: 'lightgray'
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



   //Get SubscriptionType
   getSubscribeTypes() {
    let url = this.baseUrl + "/uui-lcm/customers/service-subscriptions";
    this.http.get<any>(url, {}).subscribe((data) => {
      this.serviceSubscriptionList = data.subscriptions;
    }, (err) => {
      console.log(err);
    });
  }

  //Get subscription instanceID by calling With Subscription Type
  getServiceInstanceList(subscriptionType) {
    this.serviceInstanceList = [];
    this.selectedServiceInstance="";
    let url = this.baseUrl + "/uui-lcm/Sotnservices/ServiceInstances/" + subscriptionType;
    this.http.get<any>(url,{}).subscribe((data) => {
      this.serviceInstanceList = data.serviceInstanceList; 
    }, (err) => {
      console.log(err);
    });    
  }

  getTopologyInfo (topo) {
    this.selectedTopology = topo;
    this.getData();
    this.refreshData();
  }
  //Get subscription instanceID by calling With Subscription Type
  ngOnInit() {
      this.container = document.getElementById('mynetwork');
      this.getSubscribeTypes();
  }

  refreshData() {
      var data1 = {
          nodes: this.serviceList.nodes,
          edges: this.serviceList.edges
      };
      var network = new Network(this.container, data1, this.networkOptions);
      network.on('select', function (selection) {
          this.selectedNodeIds = selection.nodes[0]; // array of selected node's ids
          var filteredNode = data1.nodes.filter(item => (
              item.id == this.selectedNodeIds
          ));
          var t1 = '<div class="tblDiv">\
          <nz-form-label class="lblCls">Node Information</nz-form-label>\
          <table class="table table-striped table-bordered">\
              <thead>\
                  <tr>\
                      <th class="clr-primary padding-2p">Specification</th>\
                      <th class="clr-primary padding-2p">Value</th>\
                  </tr>\
              </thead>\
              <tbody>\
          ';
          Object.entries(filteredNode[0].dataNode).forEach(entry => {                
              if( entry[1] !== "null")
              {
                  t1 += '<tr class="popup-table-row">\
                      <td class="popup-table-header clr-primary padding-2p">'+ entry[0] + ':</td>\
                      <td class="popup-table-data  clr-primary padding-2p">'+ entry[1] + '</td>\
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

  getData (){
    var comp = this;
    this.http.get<summary>(this.baseUrl+'/uui-lcm/Sotnservices/resourceTopology/service/service-subscriptions/service-subscription/'+this.selectedSubscriptionType.toLowerCase()+'/service-instances/service-instance/'+this.selectedServiceInstance, {}).subscribe((data) => {
        this.serviceList = data;
        comp.refreshData();
    }, (err) => {
        console.log(err);
    });
  }
  // Getting sitedata Based On Type and ID
  getSelectedsubscriptionInfo(s) {       
      this.getData();
      this.refreshData();
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
