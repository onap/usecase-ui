export const pieChartconfig = {
    height: 320,
    option: {
        tooltip: {
            trigger: 'item',
            formatter: '{b}\n{c},{d}%'
        },
        legend: {
            orient: 'vertical',
            type: 'scroll',
            left: '0px',
            bottom: '0px',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
                color: "#3C4F8C"
            },
            data: []
        },
        color: ["#7AC0EF", "#FB7788","#6A86D8","#A6BFE4","#748CDC", "#7277D4", "#7067CE", "#B9B0F7", "#7DCFF5"],
        series: [{
            name: "",
            radius: '55%',
            center: ['50%', '45%'],
            label: {
                normal: {
                    show: false,
                },
                emphasis: {
                    show: false,
                    formatter: '{b}\n{c},{d}%',
                    color: "#3C4F8C"
                }
            }
        }]
    }
};
export const lineChartconfig = {
    height: 320,
    option: {
        "tooltip": {
            "trigger": "axis",
            "axisPointer": {
                "type": "line",
                textStyle: {
                    color: "#fff"
                },
                lineStyle: {
                    color: '#ccc'
                }
            },
        },
        legend: {
            bottom: '0px',
            type: 'scroll',
            data: []
        },
        xAxis: {
            data: []
        },
        color: ["#7AC0EF", "#FB7788","#6A86D8","#A6BFE4","#748CDC", "#7277D4", "#7067CE", "#B9B0F7", "#7DCFF5"],
        series: [
            {
                name: '',
                type: 'line',
                data: []
            },
            {
                name: 'Memory',
                type: 'line',
                data: []
            },
            {
                name: 'Disk',
                type: 'line',
                data: []
            }
        ]
    }
}