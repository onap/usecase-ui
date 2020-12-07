enum baseUrl{
    baseUrl = '/api/usecaseui-server/v1'  //online
    // baseUrl = 'https://192.168.235.25:30283/api/usecaseui-server/v1'    //local two
}

interface servicesTableData {
    total:number,
    tableList:string[]
}

export {servicesTableData , baseUrl}
