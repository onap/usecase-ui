import { Component, OnInit } from '@angular/core';
import { TextService } from '../core/services/text.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less']
})
export class TestComponent implements OnInit {
  constructor(
    private TextService: TextService,
  ) {
  }

  ngOnInit() {
    this.getMockData();
    this.getjsonData();

  }
  tableData = []
  getMockData() {
    this.TextService.getfakeData().subscribe(res => {
      console.log(res, "======fake data")
      this.tableData = res;
    })
  }
  getjsonData() {
    this.TextService.getjsonData().subscribe(res => {
      console.log(res, "======json data")
    })
  }


}
