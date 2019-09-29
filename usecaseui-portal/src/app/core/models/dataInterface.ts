enum baseUrl{
    baseUrl = '/api/usecaseui-server/v1'  //online
    // baseUrl = 'http://10.73.191.100:8082'    //local two
}

interface servicesTableData {
    total:number,
    tableList:string[]
}

export {servicesTableData , baseUrl}
