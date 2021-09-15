import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { intentBaseService } from "../../../../core/services/intentBase.service";

@Component({
  selector: 'app-cloud-leased-line',
  templateUrl: './cloud-leased-line.component.html',
  styleUrls: ['./cloud-leased-line.component.less']
})
export class CloudLeasedLineComponent implements OnInit {

  constructor(
    private router:Router,
    private myHttp: intentBaseService,
    private nzMessage: NzMessageService 
  ) {}

	ngOnChanges() {}

	ngOnInit() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getCloudLeasedLineList();
  }

	ngOnDestroy() {}

  statusObj: any = {
    0: 'Incomplete',
    1: 'Completed',
    2: 'Deleted',
    3: 'Inactive'
  }
  // 列表数据源
	listOfData: any[] = [];
  // 分页信息及总数
	pageIndex: number = 1;
	pageSize: number = 10;
	total: number = 0;
	loading = false;
  // 控制弹窗展示变量
  cloudLeasedLineShowFlag: boolean = false;
  smartCloudLeasedLineShowFlag: boolean = false;
  // 初始化查询数据源
	getCloudLeasedLineList(): void {
    this.myHttp.getInstanceList({
      currentPage: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe((response) => {
      const { code, message, data } = response;
      if (code !== 200) {
        this.nzMessage.error(message);
				return;
      }
      this.total = data.totalRecords;
      this.listOfData = [...data.list];
    }, (err) => {
      console.log(err);
    });
  }
  // 分页信息变更查询数据
  searchData(): void {
    this.getCloudLeasedLineList();
  }
  // 解析结果传递到create弹窗
  resolveResult: any;
  // 弹窗加载
	cloudLeasedLineShow(): void {
	  this.cloudLeasedLineShowFlag = true;
	}
  // 弹窗关闭
	cloudLeasedLineClose(): void {
    this.cloudLeasedLineShowFlag = false;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getCloudLeasedLineList();
  }
  // smart 弹窗加载
	smartCloudLeasedLineShow(): void {
	  this.smartCloudLeasedLineShowFlag = true;
	}
  // smart 弹窗关闭
	smartCloudLeasedLineClose(data): void {
    this.smartCloudLeasedLineShowFlag = false;
    if (data.cancel) {
      return;
    }
    this.cloudLeasedLineShowFlag = true;
    this.resolveResult = {
      name: 'test',
      instanceId: '123456',
      accessPointOne: {
        name: 'aaa',
        bandwidth: '20'
      },
      cloudPointName: 'aaa',
    };
  }
  // 跳转监控管理页面
  goMonitorService(): void {
    this.router.navigateByUrl('/fcaps/monitor_service');
  }

  activeCloudLeasedLine(row): void {
    this.myHttp.activeIntentInstance({
      instanceId: row.instanceId
    }).subscribe((data) => {
      console.log(data);
    }, (err) => {
      console.log(err);
    });
  }

  inactiveCloudLeasedLine(row): void {
    this.myHttp.invalidIntentInstance({
      instanceId: row.instanceId
    }).subscribe((data) => {
      console.log(data);
    }, (err) => {
      console.log(err);
    });
  }

  deleteCloudLeasedLine(row): void {
    this.myHttp.deleteIntentInstance(row.instanceId).subscribe((data) => {
      console.log(data);
    }, (err) => {
      console.log(err);
    });
  }
}