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
  // table lists
	listOfData: any[] = [];
  // pageSize or pageNum
	pageIndex: number = 1;
	pageSize: number = 10;
	total: number = 0;
	loading = false;
  // cantrol dialog show or hidden
  cloudLeasedLineShowFlag: boolean = false;
  smartCloudLeasedLineShowFlag: boolean = false;
  // resolve to dialog
  resolveResult: any = null;
  intervalTime: number = 5000;
  progressingTimer: any[] = [];
  
  // init source data
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
      if (data.list === 0) {
        return;
      }
      
      this.listOfData = data.list.map((item, index) => {
        if (item.status === 'Incomplete') {
          const updateStatus = (prodata) => {
            item.status = prodata.status || item.status;
          };
          
          const obj = { serviceId: item.id };
          this.queryStatus(obj, index, updateStatus).then(() => {
            item.status = "Completed";
            this.getCloudLeasedLineList();
          });
        } 
        return item;
      });
    }, (err) => {
      console.log(err);
    });
  }

  queryStatus(obj: any, index: number, callback: any) {
    return new Promise((res) => {
			const requery = () => {
        const param = [obj.id];
				this.myHttp.getInstanceStatus(param).subscribe((response) => {
						if (
							response.data.status && response.data.status === 'Incomplete') {
							callback(response.data);
							let progressSetTimeOut = setTimeout(() => {
								requery();
							}, this.intervalTime);
							this.progressingTimer.push({
								id: obj.id,
								timer: progressSetTimeOut,
							});
						} else {
							this.progressingTimer.forEach((item) => {
								if (item.serviceId === obj.serviceId) {
									clearInterval(item.timer);
								}
							});
							res(response.data);
						}
					});
			};
			requery();
		});
  }

  // change page message
  searchData(): void {
    this.getCloudLeasedLineList();
  }
  
  // dialog show
	cloudLeasedLineShow(): void {
	  this.cloudLeasedLineShowFlag = true;
	}
  // dialog close
	cloudLeasedLineClose(): void {
    this.cloudLeasedLineShowFlag = false;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getCloudLeasedLineList();
  }
  // smart dialog show
	smartCloudLeasedLineShow(): void {
	  this.smartCloudLeasedLineShowFlag = true;
	}
  // smart dialog close
	smartCloudLeasedLineClose(data): void {
    this.smartCloudLeasedLineShowFlag = false;
    if (data.cancel) {
      return;
    }

    this.resolveResult = {
      name: 'test',
      instanceId: '123456',
      accessPointOne: {
        name: 'aaa',
        bandwidth: '20'
      },
      cloudPointName: 'aaa',
    };

    this.cloudLeasedLineShowFlag = true;
  }
  // to monitor page
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