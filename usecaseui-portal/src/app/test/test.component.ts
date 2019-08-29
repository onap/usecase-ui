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
    this.getCurrentLanguage();
    this.createPostData();

  }
  tableData = []
  getMockData() {
    this.TextService.getfakeData().subscribe(res => {
      console.log(res, "======fake data")
      this.tableData = res;
    })
  }
  getjsonData() {
    this.TextService.getjsonData("xuran").subscribe(res => {
      console.log(res, "======json data")
    })
  }
  getCurrentLanguage() {
    this.TextService.getCurrentLanguage(10).subscribe(res => {
      console.log(res, "======> current language")
    })
  }
  createPostData() {
    this.TextService.getCreatensData("/upload/name", { user: "xuran" }).subscribe(res => {
      console.log(res, "======> post data")
    })
  }



}
