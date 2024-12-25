export type KnowledgeBase = {
  knowledgeBaseName: string,
  knowledgeBaseDescription: string,
  operatorName: string,
  maaSPlatformName: string,
  updateTime: string,
  filesName: Array<string>,
  operatorId: string,
  maaSPlatformId: string,
  knowledgeBaseId: string
}

export type KnowledgeBaseResponse = Response<KnowledgeBase>

export type KnowledgeBasesResponse = Response<Array<KnowledgeBase>>

export type Operators = {
  operatorId: string,
  operatorName: string,
  maaSPlatformList: Array<MaaSPlatform>,
}

export type MaaSPlatform = {
  maaSPlatformId: string,
  maaSPlatformName: string,
  operatorId: string,
  operatorName: string,
  modelList: Array<ModelInformation>;
}

export type ModelInformation = {
  modelId: string,
  modelName: string,
}

export type ResponseHeader = {
  result_header:{
    result_code: number, 
    result_message: string
  }
}

export type OperatorsResponse = Response<Array<Operators>>

export type Response<T> = {
  result_body: T
} & ResponseHeader

export type modalClose = {
  cancel: boolean
}