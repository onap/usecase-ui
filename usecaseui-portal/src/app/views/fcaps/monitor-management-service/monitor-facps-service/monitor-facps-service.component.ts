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
  chartData: any = {
    xAxis: {
      data: [
        "2018-09-10 ",
        "2018-09-11",
        "2018-09-12",
        "2018-09-13",
        "2018-09-14",
        "2018-09-15",
        "2018-09-16",
        "2018-09-17",
        "2018-09-18",
        "2018-09-19",
        "2018-09-20",
        "2018-09-21",
        "2018-09-22"
      ]
    },
    series: [
      {
        data: [
          30,
          45,
          34,
          35,
          43,
          56,
          36,
          53,
          42,
          45,
          44,
          35,
          32
        ] 
      },
      {
        data: [
          60,
          60,
          60,
          60,
          60,
          60,
          60,
          60,
          60,
          60,
          60,
          60,
          60
        ]
      }
    ]
  };
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
		},
	};
  
	initOpts: any;
	lineOption: any;
	chartIntance: any;
	updateOption: any;

	instanceLists: any[] = [];

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
				axisTick: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisLabel: {
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
    this.myHttp.queryInstancePerformanceData({ instanceId}).subscribe(
      (response) => {
        const { code, message, data } = response;
        if (code !== 200) {
          this.nzMessage.error(message);
          return;
        }
        if(this.chartIntance){
          this.updateOption = data;
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
