import { Response } from '../knowledge-base-management/knowledge-base.type';
export type Application = {
  "applicationId"?: string,
  "applicationName": string,
  "applicationDescription": string,
  "applicationType": string,
  "operatorId": string,
  "operatorName": string,
  "maaSPlatformId": string,
  "maaSPlatformName": string,
  "knowledgeBaseName": string,
  "knowledgeBaseId": string,
  "largeModelName": string,
  "largeModelId": string,
  "prompt": string,
  "temperature": number,
  "top_p": number,
  "openingRemarks": string,
}

export type ApplicationsResponse = Response<Application[]>;

export type ApplicationResponse = Response<Application>;



