import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-design-service',
  templateUrl: './design-service.component.html',
  styleUrls: ['./design-service.component.less']
})
export class DesignServiceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onLoad(evt) {
    var ifr = evt.target;
    var ifrm = ifr.contentWindow ? ifr.contentWindow : (ifr.contentDocument && ifr.contentDocument.document) ? ifr.contentDocument.document: ifr.contentDocument;
    console.log("iframe data below:");
    console.log(ifrm);
  }

  onErrors(evt) {
    
  }
}
