import { Component, OnInit } from '@angular/core';
import { Network, Node, Edge } from 'vis';

@Component({
  selector: 'app-monitor-service',
  templateUrl: './monitor-service.component.html',
  styleUrls: ['./monitor-service.component.less']
})
export class MonitorServiceComponent implements OnInit {

  selectedSubscriptionType:string = "SOTN";
  serviceSubscriptionList:any = [{
    serviceType:"SOTN"
  }];
  selectedServiceInstance:string = "SiteService-5011";
  serviceInstanceList:any = [
    {
      serviceInstance: "SiteService-5011",
      serviceInstancename: "SiteService-5011"
    },
    {
      serviceInstance: "ISAAC-IS0333",
      serviceInstancename: "ISAAC-IS0333"
    }
  ];
  selectedTopology:string = 'i18nTextDefine_networkTopology';
  serviceTopologyList:any = [
    {
      topologyType:"i18nTextDefine_networkTopology",
    },
    {
      topologyType:"i18nTextDefine_resourceTopology",
    }
  ];

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

    node1:any = {
      "nodes": [
        {
          "id": "1",
          "shape": "circularImage",
          "image": "./assets/images/edge.png",
          "label": "Node",
          "color": "Green",
          "dataNode": {
            "ethtSvcName": "sotn-021-VS-monitored",
            "colorAware": "true",
            "cbs": "100",
            "couplingFlag": "true",
            "ebs": "evpl",
            "cir": "200000",
            "eir": "0"
          }
        },
        {
          "id": "2",
          "shape": "circularImage",
          "image": "./assets/images/logicallink.png",
          "label": "Logical Link",
          "color": "Green",
          "dataNode": {
            "ethtSvcName": "sotn-021-VS-monitored",
            "colorAware": "true",
            "cbs": "100",
            "couplingFlag": "true",
            "ebs": "evpl",
            "cir": "200000",
            "eir": "0"
          }
        },
        {
          "id": "3",
          "shape": "circularImage",
          "image": "./assets/images/edge.png",
          "label": "Node",
          "color": "Green",
          "dataNode": {
            "zipcode": "100095",
            "siteName": "hubtravel",
            "description": "desc",
            "location": "laptop-5",
            "cvlan": "100"
          }
        }
      ],
      "edges": [
        {
          "from": "1",
          "to": "2"
        },
        {
          "from": "2",
          "to": "3"
        }
      ]
    }

  node2:any = {
    "nodes": [
      {
        "id": "1",
        "shape": "circularImage",
        "image": "./assets/images/tpoint.png",
        "label": "Termination Point",
        "color": "Green",
        "dataNode": {}
      },
      {
        "id": "2",
        "shape": "circularImage",
        "image": "./assets/images/edge.png",
        "label": "Node",
        "color": "Green",
        "dataNode": {
          "ethtSvcName": "sotn-021-VS-monitored",
          "colorAware": "true",
          "cbs": "100",
          "couplingFlag": "true",
          "ebs": "evpl",
          "cir": "200000",
          "eir": "0"
        }
      },
      {
        "id": "3",
        "shape": "circularImage",
        "image": "./assets/images/logicallink.png",
        "label": "Logical Link",
        "color": "Green",
        "dataNode": {
          "ethtSvcName": "sotn-021-VS-monitored",
          "colorAware": "true",
          "cbs": "100",
          "couplingFlag": "true",
          "ebs": "evpl",
          "cir": "200000",
          "eir": "0"
        }
      },
      {
        "id": "4",
        "shape": "circularImage",
        "image": "./assets/images/edge.png",
        "label": "Node",
        "color": "Green",
        "dataNode": {
          "zipcode": "100095",
          "siteName": "hubtravel",
          "description": "desc",
          "location": "laptop-5",
          "cvlan": "100"
        }
      },
      {
        "id": "5",
        "shape": "circularImage",
        "image": "./assets/images/tpoint.png",
        "label": "Termination Point",
        "color": "Green",
        "dataNode": {
          "accessltpid": "155",
          "siteName": "hubtravel",
          "description": "desc",
          "accessnodeid": "10.10.10.10",
          "cvlan": "100"
        }
      }
    ],
    "edges": [
      {
        "from": "1",
        "to": "2"
      },
      {
        "from": "2",
        "to": "3"
      },
      {
        "from": "3",
        "to": "4"
      },
      {
        "from": "4",
        "to": "5"
      }
    ]
  }

  constructor() { }

  intervalData: any;
  returnResponse: boolean = true;

  //Get SubscriptionType
  getSubscribeTypes() {
      this.getTopologyInfo('i18nTextDefine_networkTopology');
  }

  getTopologyInfo (topo) {
    this.selectedTopology = topo;
    this.getData();
    this.refreshData();
  }

  //Get subscription instanceID by calling With Subscription Type
  getServiceInstanceList(subscriptionType) {
          this.getSelectedsubscriptionInfo(subscriptionType);
  }
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

  getData ()
  {
    if (this.selectedTopology == 'i18nTextDefine_networkTopology') {
      this.serviceList = this.node1;
    } else {
      this.serviceList = this.node2;
    }
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
