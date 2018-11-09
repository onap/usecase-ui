/*
    Copyright (C) 2018 CMCC, Inc. and others. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {networkHttpservice} from '../networkHttpservice.service';

@Component({
  selector: 'app-ccvpn-network',
  templateUrl: './ccvpn-network.component.html',
  styleUrls: ['./ccvpn-network.component.css']
})
export class CcvpnNetworkComponent implements OnInit {

  constructor(private myhttp: networkHttpservice) {
  }

  ngOnInit() {
    var thisNg = this;
    thisNg.getD3Data();


    //本地云TP端口连线，点击右侧展开详情
    $('#tpContainer').on('click', '.line-port', function () {
      thisNg.isVisible = false;
      thisNg.delBoxisVisible = true;
      thisNg.delcloud = false;

      thisNg.delTp1 = $(this).attr('data-tp1');
      thisNg.delTp2 = $(this).attr('data-tp2');
      thisNg.delNode1 = $(this).attr('data-node1');
      thisNg.delNode2 = $(this).attr('data-node2');
      thisNg.delVersion = $(this).attr('data-version');
      thisNg.delLinkname = $(this).attr('data-link');
      thisNg.delcloudUrl = null;
      thisNg.delLinkIndex = $(this);

      let dataD3 = thisNg.d3Data;
      for (let p = 0; p < dataD3.length; p++) {//判断两个tp端口分别属于哪个Domain network
        if (dataD3[p]['name'] == thisNg.delTp1) {
          thisNg.network.push(dataD3[p]['source']['name']);
        }
        if (dataD3[p]['name'] == thisNg.delTp2) {
          thisNg.network.push(dataD3[p]['source']['name']);
        }
      }
      thisNg.delNetwork1 = thisNg.network[0];
      thisNg.delNetwork2 = thisNg.network[1];
    });

    //外部云连线 ，点击右侧展开详情
    $('#tpContainer').on('click', '.cloudline', function () {
      thisNg.isVisible = false;
      thisNg.delBoxisVisible = true;
      thisNg.delcloud = true;

      thisNg.delTp1 = $(this).attr('data-tp1');
      thisNg.delTp2 = $(this).attr('data-tp2');
      thisNg.delNode1 = $(this).attr('data-node1');
      thisNg.delNode2 = $(this).attr('data-node2');
      thisNg.delVersion = $(this).attr('data-version');
      thisNg.delNetwork1 = $(this).attr('data-network');
      thisNg.delNetwork2 = $(this).attr('data-cloudnetwork');
      thisNg.delcloudUrl = $(this).attr('data-url');
      thisNg.delLinkname = $(this).attr('data-link');
      thisNg.aaiId = $(this).attr('data-aaiid');
      thisNg.getCloudUrl(thisNg.aaiId, thisNg);
    });
  }

  addLinkDisabled = true;
  isVisible = false;
  outCloudShow = false;
  inputshow = false;
  delBoxisVisible = false;

  d3Data = [];//D3渲染需要的数据
  logicalLinks = [];//logicalLinks接口返回的已有的连线数据
  linkName = null;//连线的名字link-name
  networkOption = [];//表单network下拉选框填充的数据
  nodeOption1 = {};//node下拉选框填充的数据
  tpOption1 = [];//node下拉选框填充的数据
  tpOption2 = [];//node下拉选框填充的数据
  networkVal1 = null;//network1下拉框默认数据
  networkVal2 = null;//network2下拉框默认数据
  selectedNode1 = null;//node1下拉框默认数据
  selectedNode2 = null;//node2下拉框默认数据
  selecteTpName1 = null;//TP1下拉框默认数据
  selecteTpName2 = null;//TP2下拉框默认数据
  cloudUrl = null;//外部云URL地址
  cloudNetwork = null;//外部云network名称
  cloudNode = null;//外部云Node名称
  cloudTp = null;//外部云Tp名称

  dataCloud = [];//外部云的信息
  dataCloudLink = [];
  aaiId = '';


  //删除连线时 右侧框显示的数据
  delLinkname = null;
  delNetwork1 = null;
  delNode1 = null;
  delTp1 = null;
  delcloudUrl = null;
  delNetwork2 = null;
  delNode2 = null;
  delTp2 = null;
  delVersion = null;
  delLinkIndex = null;
  network = [];
  delcloud = false;

  winWidth = $('.content').width();
  winHeight = $('.content').height();
  charge = -300;

  imgmap = {
    '1': './assets/images/cloud-county1.png',
    '2': './assets/images/cloud-city1.png',
    '3': './assets/images/cloud-out.png',
  };
  tpoption = {
    container: '#tpContainer',
    data: '',
    width: 1000,
    height: this.winHeight
  };

  showForm(): void {
    if (this.addLinkDisabled == false) {
      this.isVisible = true;
      this.delBoxisVisible = false;
    }
  }

  hideForm(): void {
    this.isVisible = false;
    this.delBoxisVisible = false;
    this.linkName = null;
    this.networkVal1 = null;//初始化network1下拉框默认数据
    this.networkVal2 = null;//初始化network2下拉框默认数据
    this.selectedNode1 = null;//初始化node1下拉框默认数据
    this.selectedNode2 = null;//初始化node2下拉框默认数据
    this.selecteTpName1 = null;//初始化TP1下拉框默认数据
    this.selecteTpName2 = null;//初始化TP2下拉框默认数据
    this.cloudUrl = null;//外部云URL地址
    this.cloudNetwork = null;//外部云network名称
    this.cloudNode = null;//外部云Node名称
    this.cloudTp = null;//外部云Tp名称
  }

  //获取云图数据
  getD3Data() {
    this.myhttp.getNetworkD3Data()
      .subscribe((data) => {
        if (data.length == 0) {
          this.addLinkDisabled = false;
          return;
        }
        for (let ii = 0; ii < data.length; ii++) {//判断数据里是否有外部云信息，有就踢出来
          if (data[ii]['aaiId'] != null) {
            this.dataCloud = data.splice(ii, 1);
          }
        }

        for (var i = 0; i < data.length; i++) {
          let name1 = {}, name2 = {};
          let nodess = [];
          name1['name'] = name2['network'] = data[i]['networkId'];
          name1['type'] = '1';
          name1['source'] = i;
          this.d3Data.push(name1);
          for (let c = 0; c < data[i]["pnfs"].length; c++) {
            nodess.push(data[i]['pnfs'][c]['pnfName']);
            this.nodeOption1[name2['network']] = nodess;
          }
          this.networkOption.push(name2);
        }
        console.log(this.networkOption);
        for (var i = 0; i < data.length; i++) {
          let tp_length = data[i]['tps'].length;
          for (var h = 0; h < tp_length; h++) {
            let name2 = {};
            let interface_name = data[i]['tps'][h]['interface-name'];
            name2['name'] = interface_name;
            name2['type'] = '2';
            name2['source'] = i;
            this.d3Data.push(name2);
          }
        }
        for (let b = 0; b < this.d3Data.length; b++) {
          this.d3Data[b]['target'] = b;
        }
        this.initPosition(this.d3Data);
        // setTimeout(this.render(this.d3Data, this.imgmap, this.dataCloud, this.charge, data), 0);
      }, (err) => {
        console.log(err);
      });

  }

  //获取云图初始的连线状态 getlogicalLinksData
  getLinksData() {
    this.myhttp.getLogicalLinksData()
      .subscribe((data) => {
        if (data["status"]=="FAILED") {
          return;
        }
        for (let i = 0; i < data["logical-link"].length; i++) {//判断获取的连线里书否存在外部云连线，有就踢出来
          if (data['logical-link'][i]['relationship-list']['relationship'].length > 2) {
            this.dataCloudLink = data['logical-link'].splice(i, 1);
          }
        }

        for (let i = 0; i < data["logical-link"].length; i++) {
          let textval = [];
          textval[0] = data['logical-link'][i]['relationship-list']['relationship'][0]['relationship-data'][1]['relationship-value'];//tp1
          textval[1] = data['logical-link'][i]['relationship-list']['relationship'][1]['relationship-data'][1]['relationship-value'];//tp2
          textval[2] = data['logical-link'][i]['resource-version'];//version
          textval[3] = data['logical-link'][i]['relationship-list']['relationship'][0]['relationship-data'][0]['relationship-value'];//node1
          textval[4] = data['logical-link'][i]['relationship-list']['relationship'][1]['relationship-data'][0]['relationship-value'];//node2
          textval[5] = data['logical-link'][i]['operational-status'];
          textval[6] = data['logical-link'][i]['link-name'];
          this.logicalLinks.push(textval);
          this.chose(textval);
        }
        console.log(this.logicalLinks);
        if (this.dataCloudLink.length > 0) {
          this.getcloudLine(this.dataCloudLink);
        }
      }, (err) => {
        console.log(err);
      });
  }

  //D3云图渲染
  render(nodes, imgmap, dataCloud, charge, dataD3) {
    var thiss = this;
    var _this = this.tpoption,
      width = null,
      height = _this.height;
    if (_this.width > 800) {
      width = _this.width;
    } else {
      width = 800;
    }
    if (dataD3.length <= 4) {
      charge = -300;
    } else if (dataD3.length > 4 && dataD3.length <= 6) {
      charge = -160;
    } else if (dataD3.length > 6 && dataD3.length <= 10) {
      charge = -110;
    } else {
      charge = -100;
    }
    console.log(charge);
    var svg = d3.select(_this.container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'content-svg')
        .style('pointer-events', 'all'),
      graph = svg.append('g').attr('class', 'graph').attr('id', 'graph'),

      _g_nodes = graph.selectAll('g.node')
        .data(nodes)
        .enter()
        .append('g')
        .style('display', function (d) {
          var display = 'block';
          switch (d.type) {
            case '1':
              display = 'none';
              break;
            case '2':
              display = 'none';
              break;
            default:
              break;
          }
          return display;
        })
        .style('cursor', 'pointer')
        .attr('class', 'node'),

      _g_lines = graph.selectAll('line.line')
        .data(nodes)
        .enter()
        .append('g')
        .style('display', 'none')
        .attr('class', 'line');


    _g_lines.append('line')
      .style('stroke', '#93c62d'
      )
      .style('stroke-width', 2);

    _g_nodes.append('image')
      .attr('width', function (d) {
        var width = 40;
        switch (d.type) {
          case '1':
            width = 4.4 * width;
            break;
          case '2':
            width = 0.12 * width;
            break;
          default:
            break;
        }
        return width;
      })
      .attr('height', function (d) {
        var height = 20;
        switch (d.type) {
          case '1':
            height = 3.5 * height;
            break;
          case '2':
            height = 0.2 * height;
            break;
          default:
            break;
        }
        return height;
      })
      .attr('xlink:href', function (d) {
        return imgmap[d.type];
      });

    _g_nodes.append('text')
      .text(function (d) {
        return d.name;
      })
      .style('transform', function (d) {
        var x = null;
        var y = null;
        switch (d.type) {
          case '1':
            x = 7;
            y = -7;
            break;
          case '2':
            x = 1;
            y = -2;
            break;
          default:
            break;
        }
        return 'translate(' + x + '%,' + y + '%)';
      })
      .style('font-size', function (d) {
        var size = 14;
        switch (d.type) {
          case '1':
            size = 14;
            break;
          case '2':
            size = 12;
            break;
          default:
            break;
        }
        return size;
      })
      .style('fill', function (d) {
        var color = '#666';
        switch (d.type) {
          case '1':
            color = '#666';
            break;
          case '2':
            color = '#666';
            break;
          default:
            break;
        }
        return color;
      })
      .style('font-weight', '500');


    //线上添加自定义属性
    _g_lines.each(function (d, i) {
      var _this = d3.select(this);
      if (d.name) {
        _this.attr('data-text', d.name);
      }
    });

    var force = d3.layout.force()
      .size([1000, this.winHeight])
      .linkDistance(5)
      // .theta(0.6)
      .charge(charge)
      .nodes(nodes)
      .links(nodes)
      .start();

    //添加拖拽行为
    // _g_nodes.call(this.getDragBehavior(force));

    force.on('tick', function () {
      if (force.alpha() <= 0.04) {

        _g_nodes.style('display', function (d) {
          var display = 'block';
          switch (d.type) {
            case '1':
              display = 'block';
              break;
            case '2':
              display = 'none';
              break;
            default:
              break;
          }
          return display;
        });

        nodes.forEach(function (d, i) {
          d.x = d.x - 25 < 0 ? 25 : d.x;
          d.x = d.x + 25 > width ? width - 25 : d.x;
          d.y = d.y - 15 < 0 ? 15 : d.y;
          d.y = d.y + 15 > height ? height - 15 : d.y;
        });

        _g_nodes.attr('transform', function (d) {

          let image = d3.select(this).select('image')[0][0],
            halfWidth = parseFloat(image.attributes[0]['value']) / 2,
            halfHeight = parseFloat(image.attributes[1]['value']) / 2;
          let xx = d.x - halfWidth,
            yy = d.y - halfHeight;
          // if (xx < 0) {
          //   xx = -xx;
          // }
          // if (yy < 0) {
          //   yy = -yy;
          // }
          return 'translate(' + xx + ',' + yy + ')';
        });

        _g_lines.select('line')
          .attr('x1', function (d) {
            return d.source.x;
          })
          .attr('y1', function (d) {
            return d.source.y;
          })
          .attr('x2', function (d) {
            return d.target.x;
          })
          .attr('y2', function (d) {
            return d.target.y;
          });

        _g_nodes.select('text').attr('dy', function (d) {
          var image = this.previousSibling,
            height = parseFloat(image.attributes[1]['value']),
            fontSize = 12;
          return height + 1.5 * fontSize;
        });
      }
    });

    force.on('end', function () {
      force.stop();
      if (dataCloud.length > 0) {
        thiss.getoutCloud(dataCloud, imgmap);
      }
      thiss.getLinksData();
      thiss.addLinkDisabled = false;
    });

  };

  //拓扑图拖拽效果
  getDragBehavior(force) {

    return d3.behavior.drag()
      .origin(function (d) {
        return d;
      })
      .on('dragstart', dragstart)
      .on('drag', dragging)
      .on('dragend', dragend);

    function dragstart(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed('dragging', true);
      force.start();
    }

    function dragging(d) {
      d.x = d3.event.x;
      d.y = d3.event.y;
    }

    function dragend(d) {
      d3.select(this).classed('dragging', false);
    }

  }

  //初始化节点位置
  initPosition(datas) {
    let origin = [this.tpoption.width / 2, this.tpoption.height / 2];
    let points = this.getVertices(origin, Math.min(this.tpoption.width / 2, this.tpoption.height / 2), datas.length);
    datas.forEach((item, i) => {
      item.x = points[i].x;
      item.y = points[i].y;
    });
  }

  //根据多边形获取定位点
  getVertices(origin, r, n) {
    if (typeof n !== 'number') return;
    var ox = origin[0];
    var oy = origin[1];
    var angle = 30 * n / n;
    var i = 0;
    var points = [];
    var tempAngle = 0;
    while (i < n) {
      tempAngle = (i * angle * Math.PI) / 180;
      points.push({
        x: ox - r * Math.sin(tempAngle),
        y: oy - r * Math.cos(tempAngle),
      });
      i++;
    }
    return points;
  }

  //渲染外部云
  getoutCloud(dataCloud, imgmap) {
    var _this = this,
      width;
    let networkId = dataCloud[0]['networkId'];
    if (_this.tpoption.width > 800) {
      width = _this.tpoption.width;
    } else {
      width = 800;
    }
    var svg = d3.select('#content-svg');
    svg.append('g').attr('class', 'out').attr('id', 'out').style({'display': 'block'}).attr('transform', 'translate(' + (width - 200) + ',0)');
    var out = d3.select('#out');
    out.append('image').style('width', '200').style('height', '118').attr('xlink:href', imgmap['3']);
    out.append('text').text(networkId)
      .style('transform', 'translate(0，0)')
      .style('font-size', '16')
      .style('font-weight', '400')
      .attr('dx', '40')
      .attr('dy', '70')
      .style('fill', '#666');
  }

  //外部云连接
  getcloudLine(dataCloudLink) {
    let textval = [];
    textval[0] = dataCloudLink[0]['relationship-list']['relationship'][0]['relationship-data'][1]['relationship-value'];//tp1
    textval[1] = dataCloudLink[0]['relationship-list']['relationship'][1]['relationship-data'][1]['relationship-value'];//tp2
    textval[2] = dataCloudLink[0]['resource-version'];//version
    textval[3] = dataCloudLink[0]['relationship-list']['relationship'][0]['relationship-data'][0]['relationship-value'];//node1
    textval[4] = dataCloudLink[0]['relationship-list']['relationship'][1]['relationship-data'][0]['relationship-value'];//node2
    textval[5] = dataCloudLink[0]['operational-status'];//status
    textval[6] = dataCloudLink[0]['relationship-list']['relationship'][2]['relationship-data'][0]['relationship-value'];//aaiId
    textval[7] = this.dataCloud[0]['networkId'];
    console.log(this.dataCloud);
    let dataD3 = this.d3Data;
    for (let p = 0; p < dataD3.length; p++) {//判断两个tp端口分别属于哪个Domain network
      if (dataD3[p]['name'] == textval[0]) {
        textval[8] = dataD3[p]['source']['name'];//network1
      }
    }
    textval[9] = dataCloudLink[0]['link-name'];
    let lines_json = {};
    var _this = this,
      width;
    if (_this.tpoption.width > 800) {
      width = _this.tpoption.width;
    } else {
      width = 800;
    }
    for (let i = 0; i < $(".node").length; i++) {
      if ($('.node').eq(i).find('text').html() == textval[8]) {
        //获取二级的x,y坐标
        var translates = $('.node').eq(i).css('transform');
        lines_json['x1'] = parseFloat(translates.substring(7).split(',')[4]);
        lines_json['y1'] = parseFloat(translates.substring(7).split(',')[5]);
        lines_json['x2'] = width - 100;
        lines_json['y2'] = 100;
      }
    }
    var x1 = lines_json['x1'];
    var y1 = lines_json['y1'];
    var x2 = lines_json['x2'];
    var y2 = lines_json['y2'];
    var color = '#14bb58';
    if (textval[5] == 'up') {
      color = '#14bb58';
    } else {
      color = 'red';
    }
    var line = '<line class=\'line cloudline line-click\' stroke=\'' + color + '\' stroke-width=\'2\' style=\'cursor:pointer\'></line>';
    var svg = d3.select('#graph');
    $('.cloudline').remove();
    $('#graph').prepend(line);
    $('.cloudline').attr({
      x1: x1 + 100,
      y1: y1 + 10,
      x2: x2,
      y2: y2,
      'data-tp1': textval[0],
      'data-tp2': textval[1],
      'data-version': textval[2],
      'data-node1': textval[3],
      'data-node2': textval[4],
      'data-network': textval[8],
      'data-cloudnetwork': textval[7],
      'data-url': '',
      'data-aaiid': textval[6],
      'data-link': textval[9],
    });
    svg.html(svg.html());
  }


  //查询外部云host url地址
  getCloudUrl(aaiId, thisNg) {
    this.myhttp.queryCloudUrl(aaiId)
      .subscribe((data) => {
        thisNg.delcloudUrl = data['service-url'];
      }, (err) => {
        console.log(err);
      });
  }


  //右侧表单下拉选框数据填充 三级联动
  //Left Port
  network1Change(value: string): void {
    this.selectedNode1 = this.nodeOption1[value][0];
    this.getPInterfaces1();
  }

  node1Change(): void {
    this.getPInterfaces1();
  }

  //获取指定node下的TP数据
  getPInterfaces1() {
    let params = {
      pnfName: this.selectedNode1,
    };
    this.myhttp.getPInterfacesData1(params)
      .subscribe((data) => {
        this.tpOption1 = [];
        for (let i = 0; i < data.length; i++) {
          let tpName = data[i]['interface-name'];
          this.tpOption1.push(tpName);
        }
        this.selecteTpName1 = this.tpOption1[0];
      }, (err) => {
        console.log(err);
      });
  }

  //Right Port
  network2Change(value: string): void {
    this.selectedNode2 = this.nodeOption1[value][0];
    this.getPInterfaces2();
  }

  node2Change(): void {
    this.getPInterfaces2();
  }

  //获取指定node下的TP数据
  getPInterfaces2() {
    let params = {
      pnfName: this.selectedNode2,
    };
    this.myhttp.getPInterfacesData2(params)
      .subscribe((data) => {
        this.tpOption2 = [];
        for (let i = 0; i < data.length; i++) {
          let tpName = data[i]['interface-name'];
          this.tpOption2.push(tpName);
        }
        this.selecteTpName2 = this.tpOption2[0];
      }, (err) => {
        console.log(err);
      });
  }

  //提交表单，连线
  submitForm(): void {
    //当页面ONAP未选中，即本地云端TP连线
    var _thiss = this;
    if (this.inputshow == false) {
      if (this.linkName == null || this.networkVal1 == null || this.selectedNode1 == null || this.selecteTpName1 == null || this.networkVal2 == null || this.selectedNode2 == null || this.selecteTpName2 == null) {
        alert('服务端口不能为空，请选择端口信息');
        return;
      } else if (this.networkVal1 == this.networkVal2) {
        alert('同一云服务下的TP端口不能相连！');
        return;
      }
      let tp_links = [],
        tp1 = this.selecteTpName1,
        tp2 = this.selecteTpName2;
      for (let i = 0; i < $(".line-port").length; i++) {
        let data_text1 = $('.line-port').eq(i).attr('data-tp1');
        let data_text2 = $('.line-port').eq(i).attr('data-tp2');
        tp_links.push(data_text1);
        tp_links.push(data_text2);
      }
      if (tp_links.indexOf(tp1) != -1 || tp_links.indexOf(tp2) != -1) {
        alert('此端口号连线已存在！');
        return;
      }
      this.createTpLinks();

    } else {
      //当页面ONAP选中，即创建外部云，连线
      if (this.linkName == null || this.networkVal1 == null || this.selectedNode1 == null || this.selecteTpName1 == null || this.cloudUrl == null || this.cloudNetwork == null || this.cloudNode == null || this.cloudTp == null) {
        alert('服务端口不能为空，请填写完整的端口信息');
        return;
      }
      let tp_links = [],
        tp1 = this.selecteTpName1;
      for (let i = 0; i < $(".line-port").length; i++) {
        let data_text1 = $('.line-port').eq(i).attr('data-tp1');
        tp_links.push(data_text1);
      }
      if (tp_links.indexOf(tp1) != -1) {
        alert('此端口号连线已存在！');
        return;
      }

      let time = this.cloudNetwork + new Date().getTime();//为外部云创建aaiid，此标识是唯一的，不可重复
      this.createCloudUrls(time)
      // Promise
      //   .all([this.createCloudNetwork(time), this.createPnfs(time), this.createCloudTp(time), this.createCloudLinks(time), this.createCloudUrls(time)])
      //   .then(function (results) {
      //     console.log(results);
      //     if (results.indexOf('FAILED') == -1) {
      //       console.log(true);
      //       _thiss.queryOutCloudLink();
      //       // _thiss.outCloudShow = true;
      //       // _thiss.outCloud(_thiss.imgmap);
      //       // setTimeout(_thiss.cloudLine(_thiss.networkVal1, _thiss.selectedNode1, _thiss.selecteTpName1, _thiss.cloudUrl, _thiss.cloudNetwork, _thiss.cloudNode, _thiss.cloudTp, 121211,"up"), 0);
      //     } else {
      //       console.log(false);
      //     }
      //   });
    }
  }

  //创建tp连线 调用接口createLink
  createTpLinks() {
    let params = {
      'link-name': this.linkName,
      'link-type': 'cross-link',
      'operational-status': 'up',
      'relationship-list': {
        'relationship': [
          {
            'related-to': 'p-interface',
            'related-link': '/aai/v13/network/pnfs/pnf/' + this.selectedNode1 + '/p-interfaces/p-interface/' + this.selecteTpName1,
            'relationship-data': [
              {
                'relationship-key': 'pnf.pnf-id',
                'relationship-value': this.selectedNode1
              },
              {
                'relationship-key': 'p-interface.p-interface-id',
                'relationship-value': this.selecteTpName1,
              }
            ]
          },
          {
            'related-to': 'p-interface',
            'related-link': '/aai/v13/network/pnfs/pnf/' + this.selectedNode2 + '/p-interfaces/p-interface/' + this.selecteTpName2,
            'relationship-data': [
              {
                'relationship-key': 'pnf.pnf-id',
                'relationship-value': this.selectedNode2
              },
              {
                'relationship-key': 'p-interface.p-interface-id',
                'relationship-value': this.selecteTpName2
              }
            ]
          }
        ]
      }
    };
    this.myhttp.createLink(params)
      .subscribe((data) => {
        if (data['status'] == 'SUCCESS') {
          this.queryAddLink();
        }
      }, (err) => {
        console.log(err);
        console.log('创建连线接口调用失败');
      });
  }

  //创建tp连接线后马上查询新增的连线
  queryAddLink() {
    let linkName = this.linkName,
      selecteTpName1 = this.selecteTpName1,
      selecteTpName2 = this.selecteTpName2,
      selectedNode1 = this.selectedNode1,
      selectedNode2 = this.selectedNode2;
    let params = {
      'link-name': linkName,
    };
    this.myhttp.querySpecificLinkInfo(params)
      .subscribe((data) => {
        let version = data['resource-version'],
          operational_status = data['operational-status'],
          linkname = data['link-name'];
        let textval = [selecteTpName1, selecteTpName2, version, selectedNode1, selectedNode2, operational_status, linkname];
        console.log(textval);
        this.hideForm();
        this.chose(textval);
      }, (err) => {
        console.log(err);
      });
  }

  //两个TP之间的连线 坐标获取
  chose(textval) {
    var lines_json = {};
    lines_json['tp1'] = textval[0];
    lines_json['tp2'] = textval[1];
    lines_json['version'] = textval[2];
    lines_json['node1'] = textval[3];
    lines_json['node2'] = textval[4];
    lines_json['status'] = textval[5];
    lines_json['linkname'] = textval[6];
    for (let i = 0; i < $(".node").length; i++) {
      if ($('.node').eq(i).find('text').html() == textval[0]) {
        $('.node').eq(i).show();
        //获取二级的x,y坐标
        var translates = $('.node').eq(i).css('transform');
        lines_json['x1'] = parseFloat(translates.substring(7).split(',')[4]);
        lines_json['y1'] = parseFloat(translates.substring(7).split(',')[5]);
      }
      if ($('.node').eq(i).find('text').html() == textval[1]) {
        $('.node').eq(i).show();
        var translates = $('.node').eq(i).css('transform');
        lines_json['x2'] = parseFloat(translates.substring(7).split(',')[4]);
        lines_json['y2'] = parseFloat(translates.substring(7).split(',')[5]);
      }
    }
    console.log(lines_json);
    this.addLine(lines_json);
  }

  //两个TP之间的连线 连线渲染
  addLine(lines) {
    let tp1 = lines.tp1;
    let tp2 = lines.tp2;
    let version = lines.version;
    let node1 = lines.node1;
    let node2 = lines.node2;
    let status = lines.status;
    let linkname = lines.linkname;
    let x1 = lines.x1;
    let y1 = lines.y1;
    let x2 = lines.x2;
    let y2 = lines.y2;
    let color = '#14bb58';
    if (status == 'up') {
      color = '#14bb58';
    } else {
      color = 'red';
    }
    let line = '<line class=\'line line-port line-click\' stroke=\'' + color + '\' stroke-width=\'2\' style=\'cursor:pointer\'></line>';
    let svg = d3.select('#graph');
    $('#graph').prepend(line);
    $('.line').first().attr({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      'data-tp1': tp1,
      'data-tp2': tp2,
      'data-version': version,
      'data-node1': node1,
      'data-node2': node2,
      'data-link': linkname
    });
    svg.html(svg.html());
  }

  //创建外部云连线后，马上查询连线
  queryOutCloudLink() {
    let networkVal1 = this.networkVal1,
      selectedNode1 = this.selectedNode1,
      selecteTpName1 = this.selecteTpName1,
      cloudUrl = this.cloudUrl,
      cloudNetWork = this.cloudNetwork,
      cloudNode = this.cloudNode,
      cloudTp = this.cloudTp,
      linkname = this.linkName;
    let params = {
      'link-name': linkname,
    };
    this.myhttp.querySpecificLinkInfo(params)
      .subscribe((data) => {
        let version = data['resource-version'];
        let status = data['operational-status'];
        let link_name = data['link-name'];
        this.outCloudShow = true;
        this.hideForm();
        this.outCloud(this.imgmap);
        // setTimeout(this.cloudLine(networkVal1, selectedNode1, selecteTpName1, cloudUrl, cloudNetWork, cloudNode, cloudTp, version, status, link_name), 0);
      }, (err) => {
        console.log(err);
      });
  }

  //新增外部云
  outCloud(imgmap) {
    var _this = this,
      width;
    if (_this.tpoption.width > 800) {
      width = _this.tpoption.width;
    } else {
      width = 800;
    }
    var svg = d3.select('#content-svg');
    svg.append('g').attr('class', 'out').attr('id', 'out').style({'display': 'block'}).attr('transform', 'translate(' + (width - 200) + ',0)');
    var out = d3.select('#out');
    out.append('image').style('width', '200').style('height', '118').attr('xlink:href', imgmap['3']);
    out.append('text').text('Partner Network')
      .style('transform', 'translate(0，0)')
      .style('font-size', '16')
      .style('font-weight', 'bold')
      .attr('dx', '40')
      .attr('dy', '70')
      .style('fill', '#fff');
  }

  //新增 外部云连接
  cloudLine(networkVal1, selectedNode1, selecteTpName1, cloudUrl, cloudNetWork, cloudNode, cloudTp, version, status, link_name) {
    let lines_json = {};
    var _this = this,
      width;
    if (_this.tpoption.width > 800) {
      width = _this.tpoption.width;
    } else {
      width = 800;
    }
    for (let i = 0; i < $(".node").length; i++) {
      if ($('.node').eq(i).find('text').html() == networkVal1) {
        //获取二级的x,y坐标
        var translates = $('.node').eq(i).css('transform');
        lines_json['x1'] = parseFloat(translates.substring(7).split(',')[4]);
        lines_json['y1'] = parseFloat(translates.substring(7).split(',')[5]);
        lines_json['x2'] = width - 100;
        lines_json['y2'] = 100;
      }
    }
    var x1 = lines_json['x1'];
    var y1 = lines_json['y1'];
    var x2 = lines_json['x2'];
    var y2 = lines_json['y2'];
    var color = '#14bb58';
    if (status == 'up') {
      color = '#14bb58';
    } else {
      color = 'red';
    }
    var line = '<line class=\'line cloudline line-click\' stroke=\'' + color + '\' stroke-width=\'2\' style=\'cursor:pointer\'></line>';
    var svg = d3.select('#graph');
    $('.cloudline').remove();
    $('#graph').prepend(line);
    $('.cloudline').attr({
      x1: x1 + 100,
      y1: y1 + 10,
      x2: x2,
      y2: y2,
      'data-tp1': selecteTpName1,
      'data-tp2': cloudTp,
      'data-version': version,
      'data-node1': selectedNode1,
      'data-node2': cloudNode,
      'data-network': networkVal1,
      'data-cloudnetwork': cloudNetWork,
      'data-url': cloudUrl,
      'data-link': link_name
    });
    svg.html(svg.html());
  }

  //创建外部云，连线时调用以下5个接口:createCloudNetwork,createPnfs,createCloudTp,createCloudLinks,createCloudUrls
  createCloudNetwork(time) {
    let _thiss = this;
    let params =
      {
        "network-resource": [
          {
            'network-id': this.cloudNetwork,
            'provider-id': '',
            'client-id': '',
            'te-topo-id': '',
            'relationship-list': {
              'relationship': [
                {
                  'related-to': 'ext-aai-network',
                  "relationship-label": "org.onap.relationships.inventory.BelongsTo",
                  'related-link': '/aai/v13/network/ext-aai-networks/ext-aai-network/' + time,
                  'relationship-data': [
                    {
                      'relationship-key': 'ext-aai-network.aai-id',
                      'relationship-value': time
                    }
                  ]
                }
              ]
            }
          }
        ]
      };
      //做一些异步操作
      _thiss.myhttp.createNetwrok(params)
        .subscribe((data) => {
          if(data["status"]=="SUCCESS"){
            _thiss.createPnfs(time)
          }
        }, (err) => {
          console.log(err);
        });

  }

  createPnfs(time) {
    let _thiss = this;
    let params = {
      'pnf-name': this.cloudNode,
      'pnf-id': '79.79.79.79',
      'in-maint': 'true',
      'admin-status': 'up',
      'operational-status': 'up',
      'relationship-list': {
        'relationship': [
          {
            'related-to': 'network-resource',
            'relationship-label': 'tosca.relationships.network.LinksTo',
            'related-link': '/aai/v13/network/network-resources/network-resource/' + this.cloudNetwork,
            'relationship-data': [{
              'relationship-key': 'network-resource.network-id',
              'relationship-value': this.cloudNetwork
            }]
          },
          {
            'related-to': 'ext-aai-network',
            "relationship-label": "org.onap.relationships.inventory.BelongsTo",
            'related-link': '/aai/v13/network/ext-aai-networks/ext-aai-network/' + time,
            'relationship-data': [{
              'relationship-key': 'ext-aai-network.aai-id',
              'relationship-value': time
            }]
          }
        ]
      }
    };
    // var pro = new Promise(function (resolve, reject) {
      //做一些异步操作
      _thiss.myhttp.createPnf(params)
        .subscribe((data) => {
          if(data["status"]=="SUCCESS"){
            _thiss.createCloudTp(time)
          }
        }, (err) => {
          console.log(err);
        });
    // });
    // return pro;
  }

  createCloudTp(time) {
    let _thiss = this;
    let params = {
      'interface-name': this.cloudTp,
      'speed-value': '100000',
      'in-maint': 'true',
      'network-ref': '',
      'transparent': '',
      'operational-status': 'up',
    };
    let cloudNodeName = this.cloudNode;

    // var pro = new Promise(function (resolve, reject) {
      //做一些异步操作
      _thiss.myhttp.createTp(params, cloudNodeName)
        .subscribe((data) => {
          if(data["status"]=="SUCCESS"){
            _thiss.createCloudLinks(time)
          }
        }, (err) => {
          // reject(err);
          console.log(err);
        // });
    });
    // return pro;
  }

  createCloudLinks(time) {
    let _thiss = this;
    let params = {
      'link-name': this.linkName,
      'in-maint': '',
      'link-type': '',
      'speed-value': '',
      'operational-status': 'up',
      'relationship-list': {
        'relationship': [
          {
            'related-to': 'p-interface',
            'related-link': '/aai/v13/network/pnfs/pnf/' + this.selectedNode1 + '/p-interfaces/p-interface/' + this.selecteTpName1,
            'relationship-data': [
              {
                'relationship-key': 'pnf.pnf-id',
                'relationship-value': this.selectedNode1
              },
              {
                'relationship-key': 'p-interface.p-interface-id',
                'relationship-value': this.selecteTpName1
              }
            ]
          },
          {
            'related-to': 'p-interface',
            'related-link': '/aai/v13/network/pnfs/pnf/' + this.cloudNode + '/p-interfaces/p-interface/' + this.cloudTp,
            'relationship-data': [
              {
                'relationship-key': 'pnf.pnf-id',
                'relationship-value': this.cloudNode
              },
              {
                'relationship-key': 'p-interface.p-interface-id',
                'relationship-value': this.cloudTp
              }
            ]
          },
          {
            'related-to': 'ext-aai-network',
            "relationship-label": "org.onap.relationships.inventory.BelongsTo",
            'related-link': '/aai/v13/network/ext-aai-networks/ext-aai-network/' + time,
            'relationship-data': [
              {
              'relationship-key': 'ext-aai-network.aai-id',
              'relationship-value': time
            }
            ]
          }
        ]
      }
    };
    // var pro = new Promise(function (resolve, reject) {
      //做一些异步操作
      _thiss.myhttp.createCloudLink(params)
        .subscribe((data) => {
          // resolve(data['status']);
          if(data["status"]=="SUCCESS"){
            _thiss.queryOutCloudLink();
          }
        }, (err) => {
          // reject(err);
          console.log(err);
        });
    // });
    // return pro;
  }

  createCloudUrls(time) {
    let _thiss = this;
    let params = {
      'aai-id': this.cloudNetwork + time,
      'esr-system-info': {
        'esr-system-info-id': '',
        'service-url': this.cloudUrl,
        'user-name': '',
        'password': '!',
        'system-type': 'ONAP'
      }
    };
    // var pro = new Promise(function (resolve, reject) {
      //做一些异步操作
      _thiss.myhttp.createCloudUrl(params)
        .subscribe((data) => {
          if(data["status"]=="SUCCESS"){
            console.log(true);
            _thiss.createCloudNetwork(time);
          }
          // resolve(data['status']);
        }, (err) => {
          // reject(err);
          console.log(err);
        });
    // });
    // return pro;
  }

  //本地云TP端口 删除连线 调用接口deleteLink
  delLink(): void {
    let deltp1 = this.delTp1,
      deltp2 = this.delTp2,
      version = this.delVersion,
      dellinkname = this.delLinkname,
      delLinkIndex = this.delLinkIndex;
    let params = {
      'logical-link': dellinkname,
      'resource-version': version,
    };
    this.myhttp.deleteLink(params)
      .subscribe((data) => {
        if (data['status'] == 'SUCCESS') {
          this.delLine(deltp1, deltp2);
          delLinkIndex.remove();
        }
      }, (err) => {
        console.log(err);
        console.log('删除连线接口调用失败');
      });
  }

  delLine(val1, val2) {
    this.delBoxisVisible = false;
    for (let i = 0; i < $(".node").length; i++) {
      if ($('.node').eq(i).find('text').html() == val1) {
        $('.node').eq(i).hide();
      }
      if ($('.node').eq(i).find('text').html() == val2) {
        $('.node').eq(i).hide();
      }
    }
  }


  //外部云 删除连线 调用接口deleteCloudLink
  delCloudLink(): void {
    let deltp1 = this.delTp1,
      deltp2 = this.delTp2,
      dellinkname = this.delLinkname,
      version = this.delVersion;
    let params = {
      'logical-link': dellinkname,
      'resource-version': version,
    };
    this.myhttp.deleteLink(params)
      .subscribe((data) => {
        console.log(data);
        console.log(typeof data);
        if (data['status'] == 'SUCCESS') {
          console.log('删除成功');
          this.delLine(deltp1, deltp2);
          $('.cloudline').remove();
        }
      }, (err) => {
        console.log(err);
        console.log('删除连线接口调用失败');
      });
  }

}
