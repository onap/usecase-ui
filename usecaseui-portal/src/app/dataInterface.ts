export enum baseUrl{
    baseUrl = '/api/usecaseui-server/v1'  //online
    // baseUrl = 'http://172.19.44.223/api/usecaseui-server/v1'     //local one
    // baseUrl = 'http://10.73.191.100:8082'    //local two
}

interface homeData {
    services:{
        number:number,
        chartdata:Object[]
    },
    performance:{
        per_Vnf:number,
        per_VmPm:number
    },
    alarm:{
        chartdata:Object[]
    },
    Vm_performance:{
        names:string[]
    }
};

interface homeVmLineData {
    CPU:number[],
    Memory:number[]
}

interface servicesSelectData {
    customer:string[],
    serviceType:string[]
}

interface servicesTableData {
    total:number,
    tableList:string[]
}

interface creatensData {
    total:number,
    tableList:string[]
}

interface onboardTableData {
    total:number,
    tableList:string[]
}

interface onboardDataVNF {
    total:number,
    tableList:string[]
}

interface onboardDataPNF {
    total:number,
    tableList:string[]
}
export {homeData, homeVmLineData, servicesSelectData, servicesTableData, creatensData, onboardTableData, onboardDataVNF, onboardDataPNF,baseUrl}
