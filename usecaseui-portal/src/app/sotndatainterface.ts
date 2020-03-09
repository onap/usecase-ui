interface site{
    siteId : String;
    siteNo:String;
    siteName : String;
    isCloudSite : String;
    location : String;  
    
    role : String;
    site_name:String;
    capacity : String;
    interface: String;
    subnet : String;
    price : String;
    cameras:any[];
    checked: boolean;
    expand: boolean;
   
    l2vpn_type:String;
    l2vpn_address:String;
    l2vpn_email:String;
    l2vpn_startTime:String;
    l2vpn_EndTime:String;
    reRoute:String;
    colorAware:String;
    couplingFlag:String;    
   l2vpn_COS:String;
   l2vpn_EBS:String;
   l2vpn_CIR:String;
   l2vpn_EIR:String;
   l2vpn_CBS:String;
   l2vpn_Spec:String;
   l2vpn_VLAN:String;
   l2vpn_Action:String;
    
    sotnSiteName:String;
    address:String;
    vlan:String;
    description: String;
    zipCode : String;
}
interface summary {
    siteArray: site[];
    vpnInfo: vpn;
    vpnBandwidth: orderBandwidthModel;
    wlanAccess:string[];
    serviceCost:string;
    filename:string;
    cost:sotnCost;
}

interface sotnCost{
    serviceCost: string;
    vpnCost: string;
    siteCost: string;
}

interface vpnArray {
    sites: site[];
}
interface vpn {
    vpnId: String;
    vpnName: String;
    vpnType: String;
    sites: site[];
    vpnBandwidth: String,
    vpnThreshold: String,
    cameras : String;
}

interface orderBandwidthModel {
    vpnId: string;
    vpnName: string;
    vpnBandwidth: number;
    Threshold: number;
}
