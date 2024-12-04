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

export type KnowledgeBaseResponse = {
  result_body: KnowledgeBase, 
  result_header: {
    result_code :number, 
    result_message: string
  }
}

