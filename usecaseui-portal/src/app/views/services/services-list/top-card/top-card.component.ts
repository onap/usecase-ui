import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-top-card',
  templateUrl: './top-card.component.html',
  styleUrls: ['./top-card.component.less']
})
export class TopCardComponent implements OnInit {
  @Input() serviceDomain: string;
  @Input() failedNum: number;
  @Input() successNum: number;
  @Input() inProgressNum: number;
  @Input() serviceDetailName: string;
  constructor() { }

  ngOnInit() {
  }

}
