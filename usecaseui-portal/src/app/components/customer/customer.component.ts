import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.less']
})
export class CustomerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  customeradd = false;
  servicesadd = false;
  //Customer pie
  CUChartData: Object;
  CUChartInit: Object = {
    height: 180,
    option: {
      color: ["#F2F6FD"],
      series: [{
        type: 'pie',
        name: "customer",
        radius: '90%',
        center: ['50%', '53%'],
        data: [{
          value: 67,

        }, {
          value: 10,

        }, {
          value: 17,

        }, {
          value: 33,
        },],
        label: {
          normal: {
            position: 'center',
            show: false,
            formatter: '   {b|{b}：{d}%}  ',
            backgroundColor: 'rgba(51,51,51,0.9)',
            borderColor: 'rgba(51,51,51,0.9)',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              b: {
                fontSize: 16,
                color: '#fff',
                lineHeight: 33
              }
            }
          },
          emphasis: {
            show: true,

          }
        },
        itemStyle: {
          normal: {
            borderWidth: 2,
            borderColor: '#ffffff',
          },
          emphasis: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#7DCEFB' // 0% 处的颜色
              }, {
                offset: 1, color: '#0DA9E2' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 10, 5, 0)'
          }
        }
      }]
    }
  };
  // getHomeAlarmData() {
  //   this.myhttp.getHomeAlarmData()
  //     .subscribe((data) => {
  //       this.alarmChartData = {
  //         series: [{
  //           data: [{ name: "Active", value: data[0] }, { name: "Fixed", value: data[1] }]
  //         }]
  //       };
  //     })
  // }

  // service bar
  serviceData: Object;
  serviceInit: Object = {
    option: {
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{c}"
      },
      grid: {
        top: '5%',
        left: '5%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#EDEDED"
            }
          },
          axisLabel: {
            color: "#3C4F8C"
          }
        }

      ],
      yAxis: [
        {
          type: 'category',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#EDEDED"
            }
          },
          axisLabel: {
            color: "#3C4F8C"
          },
          data: ['Other', 'Type1', 'Type2', 'Type3', 'Type4'],
        },

      ],
      series: [
        {
          name: '',
          barWidth: '40%',
          type: 'bar',
          data: [2800, 1700, 1200, 1000, 900],
          itemStyle: {
            normal: {
              color: function (params) {
                // build a color map as your need.
                var colorList = [
                  {
                    type: 'bar',
                    colorStops: [{
                      offset: 0,
                      color: '#FCCE2B' 
                    }, {
                      offset: 1,
                      color: '#FEE956' 
                    }],
                    globalCoord: false, 
                  },
                  {
                    type: 'bar',
                    colorStops: [{
                      offset: 0,
                      color: '#F43A59' 
                    }, {
                      offset: 1,
                      color: '#FA6C92' 
                    }],
                    globalCoord: false,
                  },
                  {
                    type: 'bar',
                    colorStops: [{
                      offset: 0,
                      color: '#4F5B60' 
                    }, {
                      offset: 1,
                      color: '#879499' 
                    }],
                    globalCoord: false, 
                  },
                  {
                    type: 'bar',
                    colorStops: [{
                      offset: 0,
                      color: '#31DAC3' 
                    }, {
                      offset: 1,
                      color: '#5FEFE3' 
                    }],
                    globalCoord: false, 
                  },
                  {
                    type: 'bar',
                    colorStops: [{
                      offset: 0,
                      color: '#999999' 
                    }, {
                      offset: 1,
                      color: '#C9C9C9'
                    }],
                    globalCoord: false, 
                  }
                ];
                return colorList[params.dataIndex]
              },
            }
          }
        },
        {
          name: 'Type4',
          type: 'bar',
          stack: '',
          data: 2800,

        },
        {
          name: 'Type1',
          type: 'bar',
          stack: '',
          data: 1700
        },
        {
          name: 'Type2',
          type: 'bar',
          stack: '',
          data: 1500
        },
        {
          name: 'Type3',
          type: 'bar',
          stack: '',
          data: 1300
        },
        {
          name: 'Other',
          type: 'bar',
          stack: '',
          data: 1000,

        }
      ]
    }
  }
}
