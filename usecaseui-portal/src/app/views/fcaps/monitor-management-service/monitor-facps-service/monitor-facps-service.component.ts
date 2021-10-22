import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { intentBaseService } from "../../../../core/services/intentBase.service";

@Component({
	selector: "app-monitor-facps-service",
	templateUrl: "./monitor-facps-service.component.html",
	styleUrls: ["./monitor-facps-service.component.less"],
})
export class MonitorFacpsServiceComponent implements OnInit {

  constructor(
    private nzMessage: NzMessageService,
    private myHttp: intentBaseService,
    private http: HttpClient
  ) {}
  
	selectedSubscriptionType: string = "";
	selectedServiceInstance: string = "";
	selectedTopology: string = "";
  instanceId: string = "";
	initData: any = {
		height: 320,
		option: {
			legend: { bottom: "0px", data: ["RATE", "MAXRATE"] },
			xAxis: { data: [] },
			series: [
				{
					name: "RATE",
					type: "line",
					itemStyle: { color: "#70ACEC" },
					data: [],
				},
        {
          name: 'MAXRATE',
          type: 'line',
          step: 'end',
          itemStyle: {
            color: "#3BCD79"
          },
          data: []
        }
			],
      tooltip: {
        trigger: 'axis',
      },
		},
	};
  
	initOpts: any;
	lineOption: any;
	chartIntance: any;
	updateOption: any;

	instanceLists: any[] = [];
  progressSetTimeOut: any;

  ngOnInit() {
    this.getFinishedInstanceInfo();
		this.initOpts = {
			renderer: "canvas",
			height: this.initData.height,
			width: this.initData.width,
		};
		this.lineOption = {
			tooltip: this.initData.option.tooltip,
			icon: "circle",
			legend: this.initData.option.legend,
			dataZoom: this.initData.option.dataZoom,
			grid: {
				left: "0%",
				right: "3%",
				top: "10%",
				bottom: "18%",
				containLabel: true,
			},
			xAxis: {
        type: "category",
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
          interval: 0,
          show: true,
          textStyle: {
            color: "#a9a9a9",
            fontSize: 10
          },
          rotate: 40,
          showMinLabel: true,
          showMaxLabel: true,
					color: "#3C4F8C",
				},
				data: this.initData.option.xAxis.data,
			},
			yAxis: {
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
					color: "#3C4F8C",
				},
				splitLine: {
					lineStyle: {
						type: "dashed",
					},
				},
			},
			series: this.initData.option.series,
		};
	}

	chartInit(chart) {
		this.chartIntance = chart;
	}

  getFinishedInstanceInfo() {
    this.myHttp.getFinishedInstanceInfo().subscribe(
      (response) => {
        const { code, message, data } = response;
        if (code !== 200) {
          this.nzMessage.error(message);
          return;
        }
        this.instanceLists = [...data];
      },
      (err) => {
        console.log(err);
      }
    )
  }

	queryInstancePerformance(instanceId) {
    const requery = () => {
      this.myHttp.queryInstancePerformanceData({ instanceId}).subscribe(
        (response) => {
          const { code, message, data } = response;
          if (code !== 200) {
            this.nzMessage.error(message);
          } else {
            if(this.chartIntance) {
              this.updateOption = data;
            }
          }

          if (this.progressSetTimeOut) {
            clearInterval(this.progressSetTimeOut);
          }
          
          this.progressSetTimeOut = setTimeout(() => {
            requery();
          }, 5000);
        },
        (err) => {
          console.log(err);
        }
      )
    }
    requery();
  }
}
