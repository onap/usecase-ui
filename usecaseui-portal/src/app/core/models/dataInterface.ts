enum baseUrl{
    baseUrl = '/api/usecaseui-server/v1'  //online
    // baseUrl = 'https://192.168.235.77:30283'    //local two
}

interface servicesTableData {
    total:number,
    tableList:string[]
}

export {servicesTableData , baseUrl}
