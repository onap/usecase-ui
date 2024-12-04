import { Injectable } from '@angular/core';
import { KnowledgeBase } from './knowledge-base.type';

@Injectable()
export class KnowledgeBaseService {

  constructor() { }
  getFiles(v: KnowledgeBase) {
    return v.filesName ? v.filesName.join(',') : '';
  }
}
