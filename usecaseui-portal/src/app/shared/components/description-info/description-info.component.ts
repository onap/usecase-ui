import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-description-info',
  templateUrl: './description-info.component.html',
  styleUrls: ['./description-info.component.less']
})
export class DescriptionInfoComponent implements OnInit {

  constructor(
  ) { }
  @Input() data: Array<any>;

  ngOnInit() {
    console.log('data is :', this.data)
  }

}