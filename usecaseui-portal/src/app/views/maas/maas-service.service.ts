import { Injectable } from '@angular/core';

@Injectable()
export class MaasService {

  constructor() { }

  generateUniqueId(): string {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}${randomNum}`;
  }

  updateCharCount(textarea: HTMLTextAreaElement, charCount: HTMLElement) {
    const charCountValue = textarea.value.length;
    const maxLength = textarea.getAttribute('maxlength');
    charCount.innerText = `${charCountValue}/${maxLength}`;
  
  }

}
