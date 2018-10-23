import { Component, OnInit, HostBinding } from '@angular/core';
import { MyhttpService } from '../../myhttp.service';
import { slideToRight } from '../../animates';

@Component({
  selector: 'app-onboard-vnf-vm',
  templateUrl: './onboard-vnf-vm.component.html',
  styleUrls: ['./onboard-vnf-vm.component.less'],
  animations: [ slideToRight ]
})
export class OnboardVnfVmComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;
  constructor(private myhttp: MyhttpService) { }

  ngOnInit() {
    this.getTableData();
  }


  //表格数据
  tableData = [];
  pageIndex = 1;
  pageSize = 10;
  total = 100;
  loading = false;
  sortName = null;
  sortValue = null;
  getTableData(){
    // 查询参数: 当前页码，每页条数，排序方式
    let paramsObj = {
      pageIndex:this.pageIndex,
      pageSize:this.pageSize,
      nameSort:this.sortValue
    }
    this.myhttp.getOnboardTableData(paramsObj)
      .subscribe((data)=>{
        console.log(data);
        this.total = data.body.total;
        this.tableData = data.body.tableList;
      },(err)=>{
        console.log(err);
      })
  }
  sort(sort: { key: string, value: string }): void {
    console.log(sort);
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.getTableData();
  }
  searchData(reset:boolean = false){
    console.log(reset)
    this.getTableData();
  }
  updataService(){
    console.log("updataService!");
  }
  deleteService(){
    console.log("deleteService!");
  }

}
