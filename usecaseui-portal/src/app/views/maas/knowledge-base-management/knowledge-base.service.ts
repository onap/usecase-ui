import { Injectable } from '@angular/core';
import { knowledgeBase } from './knowledge-base.type';

@Injectable()
export class KnowledgeBaseService {

  constructor() { }
  getFiles(v: knowledgeBase) {
    return v.filesName ? v.filesName.join(',') : '';
  }
}
