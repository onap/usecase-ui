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
        if (this.statusObj[item.status] === 'Incomplete') {
          const updateStatus = (prodata) => {
            item.status = prodata.status || item.status;
          };
          
          const obj = { instanceId: item.instanceId };
          this.queryStatus(obj, index, updateStatus).then(() => {
            item.status = '1';
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
        const param = {
          ids: [obj.instanceId]
        };
				this.myHttp.getInstanceStatus(param).subscribe((response) => {
          const { code, data:{ IntentInstances } } = response;
          if (code !== 200 || !IntentInstances || IntentInstances.length === 0) {
            return;
          }
          const intentInstance = IntentInstances[0];
          if (this.statusObj[intentInstance.status] === 'Incomplete') {
            callback(intentInstance);
            let progressSetTimeOut = setTimeout(() => {
              requery();
            }, this.intervalTime);
            this.progressingTimer.push({
              instanceId: obj.instanceId,
              timer: progressSetTimeOut,
            });
          } else {
            this.progressingTimer.forEach((item) => {
              if (item.instanceId === obj.instanceId) {
                clearInterval(item.timer);
              }
            });
            res(intentInstance);
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
	smartCloudLeasedLineClose(param): void {
    this.smartCloudLeasedLineShowFlag = false;
    if (param.cancel) {
      return;
    }

    this.resolveResult = param.data;
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
      const { code, message } = data;
      if (code !== 200) {
        this.nzMessage.error(message);
        return;
      }
      this.getCloudLeasedLineList();
    }, (err) => {
      console.log(err);
    });
  }

  inactiveCloudLeasedLine(row): void {
    this.myHttp.invalidIntentInstance({
      instanceId: row.instanceId
    }).subscribe((data) => {
      const { code, message } = data;
      if (code !== 200) {
        this.nzMessage.error(message);
        return;
      }
      this.getCloudLeasedLineList();
    }, (err) => {
      console.log(err);
    });
  }

  deleteCloudLeasedLine(row): void {
    this.myHttp.deleteIntentInstance(row.instanceId).subscribe((data) => {
      const { code, message } = data;
      if (code !== 200) {
        this.nzMessage.error(message);
        return;
      }
      this.getCloudLeasedLineList();
    }, (err) => {
      console.log(err);
    });
  }
}