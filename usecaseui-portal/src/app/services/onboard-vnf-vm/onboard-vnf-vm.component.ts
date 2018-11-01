import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit, HostBinding } from '@angular/core';
// import { MyhttpService } from '../../myhttp.service';
import { onboardService } from '../../onboard.service';
import { slideToRight } from '../../animates';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-onboard-vnf-vm',
  templateUrl: './onboard-vnf-vm.component.html',
  styleUrls: ['./onboard-vnf-vm.component.less'],
  animations: [ slideToRight ]
})
export class OnboardVnfVmComponent implements OnInit {
  @HostBinding('@routerAnimate') routerAnimateState;

  uploading = false;
  fileList: UploadFile[] = [];
  constructor(private myhttp: onboardService, private http: HttpClient, private msg: NzMessageService) { }

  ngOnInit() {
    this.getTableData();
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.push(file);
    console.log('beforeUpload')
    // this.myhttp.getCreatensData()
    //   .subscribe((data) => {
    //     console.log(33, data);
    //   }, (err) => {
    //     console.log(err);
    //   })

    return false;
  }

  handleUpload(): void {
    console.log('startUpload')
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts/', formData, {
      reportProgress: true,
      withCredentials: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (event: {}) => {
          this.uploading = false;
          this.getTableData();
          console.log('upload successfully')
          this.msg.success('upload successfully.');
        },
        err => {
          this.uploading = false;
          console.log('upload failed')
          this.msg.error('upload failed.');
        }
      );
  }
  //表格数据
  tableData = [];
  sdData = [];
  vfcData = [];
  pageIndex = 1;
  pageSize = 10;
  total = 100;
  loading = false;
  sortName = null;
  sortValue = null;
  tabs = ['NS', 'VNF', 'PNF'];
  
  isVisible = false;
  isOkLoading = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  // getCreatensData() {

  // }
  // 获取NS列表
  getTableData() {
    // 查询参数: 当前页码，每页条数，排序方式
    let paramsObj = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      nameSort: this.sortValue
    }

    this.myhttp.getOnboardTableData(paramsObj)
      .subscribe((data) => {
        console.log(99, data);
        this.total = data.body.total;
        this.sdData = data.body.tableList;
        console.log(this.sdData);
      }, (err) => {
        console.log(err);
      })

    this.myhttp.getOnboardTablePnfData(paramsObj)
      .subscribe((data) => {
        console.log(222, data);
        this.total = data.body.total;
        this.vfcData = data.body.tableList;
        console.log(this.vfcData);
        this.tableData = this.vfcData.concat(this.sdData)
        console.log(99, this.tableData)
      }, (err) => {
        console.log(err);
      })
  }

  // 获取VNF列表
  getTableVnfData() {
    // 查询参数: 当前页码，每页条数，排序方式
    let paramsObj = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      nameSort: this.sortValue
    }

    this.myhttp.getOnboardTableVnfData(paramsObj)
      .subscribe((data) => {
        console.log(222, data);
        this.total = data.body.total;
        this.tableData = data.body.tableList;
      }, (err) => {
        console.log(err);
      })
  }

  // 获取VNF列表
  getTablePnfData() {
    // 查询参数: 当前页码，每页条数，排序方式
    let paramsObj = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      nameSort: this.sortValue
    }

    this.myhttp.getOnboardTablePnfData(paramsObj)
      .subscribe((data) => {
        console.log(222, data);
        this.total = data.body.total;
        this.tableData = data.body.tableList;
      }, (err) => {
        console.log(err);
      })
  }
  // 处理tab切换
  handleTabChange(tab) {
    console.log(tab)
    switch (tab) {
      case 'NS':
        // this.tableData = []
        
        this.getTableData()
        break
      case 'VNF':
        this.getTableVnfData()
        break
      case 'PNF':
        this.getTablePnfData()
        break
    }
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
  // onboard
  updataService(id) {
    console.log(id);
  }
  //delete
  deleteService(index,pkgid) {
    console.log(pkgid)
    console.log("deleteService!");
    this.myhttp.deleteNsIdData(pkgid)
      .subscribe((data) => {
        console.log(44, data);
      }, (err) => {
        console.log(err);
      })
    this.tableData.splice(index, 1)
  }
  downloadService(id) {
    console.log('download')
    console.log(id)
    this.myhttp.downloadNsData(id)
    .subscribe((data) => {
      console.log(44, data);
    }, (err) => {
      console.log(err);
    })
  }
}
