/*
 Copyright (C) 2017 CMCC, Inc. and others. All rights reserved.

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

app.controller('devicetopologicalCtrl', ['$scope', '$http', function ($scope, $http) {
  $(document).ready(function () {
    var canvas = document.getElementById('canvas');
    var height = canvas.clientHeight;
    var width = canvas.clientWidth;
    var stage = new JTopo.Stage(canvas);
    var scene = new JTopo.Scene();
    // scene.background = '/app/uui/fusion/images/bg.jpg';


    function node(x, y, img, name, zIndex) {
      var node = new JTopo.Node(name);
      node.setImage('/app/uui/fusion/images/' + img, true);
      node.setLocation(x, y);
      node.zIndex = zIndex;
      scene.add(node);
      return node;
    }


    function newFoldLink(nodeA, nodeZ, text, direction) {
      var link = new JTopo.FoldLink(nodeA, nodeZ, text);
      link.direction = direction || 'horizontal';
      link.lineWidth = 1; // 线宽
      // link.bundleOffset = 10; // 折线拐角处的长度
      link.bundleGap = 10; // 线条之间的间隔
      line.zIndex = 8;
      scene.add(link);
      return link;
    }


    function line(startX, startY, endX, endY, name) {
      var start = new JTopo.Node();
      start.setLocation(startX, startY);
      var end = new JTopo.Node();
      end.setLocation(endX, endY);
      var line = new JTopo.Link(start, end);
      line.text = name;
      line.zIndex = 5;
      scene.add(line);
      return line;
    }

    var container = new JTopo.Container();
    container.borderRadius = 200;
    container.setBound(0, 0, 300, 300);
    container.dragble = false;
    container.background = '/app/uui/fusion/images/cloud_r.png';

    var container2 = new JTopo.Container()
    container2.borderRadius = 200;
    container2.setBound(0, 0, 300, 300);
    container2.dragble = false;
    container2.background = '/app/uui/fusion/images/cloud_r.png';

    var routerX = width / 2 - 40;
    var routerY = height / 2;

    var router1 = node(routerX - 80, routerY - 40, 'router-all.png', '');
    var router2 = node(routerX + 80, routerY - 40, 'router-all.png', '');
    scene.add(new JTopo.Link(router1, router2));

    var gateway1 = node(routerX - 200, routerY + 80, 'gateway-all.png', '', 10);
    newFoldLink(gateway1, router1);
    var gateway2 = node(routerX + 200, routerY + 80, 'gateway-all.png', '', 10);
    newFoldLink(gateway2, router2);

    var ctrl_line = line(routerX - 460, routerY + 40, routerX - 160, routerY + 40);
    var data_line = line(routerX - 460, routerY + 20, routerX - 160, routerY + 20);
    var ctrl_line_2 = line(routerX + 485, routerY + 20, routerX + 185, routerY + 20);
    var data_line_2 = line(routerX + 485, routerY + 40, routerX + 185, routerY + 40);

    var c1_vnf_1 = node(routerX - 400, routerY - 70, 'vnf-all.png', '', 6);
    var c1_vnf_2 = node(routerX - 350, routerY - 70, 'vnf-all.png', '', 6);
    var c1_vnf_3 = node(routerX - 300, routerY - 70, 'vnf-all.png', '', 6);

    var c2_vnf_1 = node(routerX + 300, routerY - 70, 'vnf-all.png', '', 6);
    var c2_vnf_2 = node(routerX + 350, routerY - 70, 'vnf-all.png', '', 6);
    var c2_vnf_3 = node(routerX + 400, routerY - 70, 'vnf-all.png', '', 6);

    var ctline_c1_vnf1 = node(routerX - 390, routerY + 50, 'map_data_point_blue.png', '');
    var daline_c1_vnf1 = node(routerX - 380, routerY + 30, 'map_data_point_blue.png', '');
    newFoldLink(c1_vnf_1, ctline_c1_vnf1);
    newFoldLink(c1_vnf_1, daline_c1_vnf1);

    var ctline_c1_vnf2 = node(routerX - 340, routerY + 50, 'map_data_point_blue.png', '');
    var daline_c1_vnf2 = node(routerX - 330, routerY + 30, 'map_data_point_blue.png', '');
    newFoldLink(c1_vnf_2, ctline_c1_vnf2);
    newFoldLink(c1_vnf_2, daline_c1_vnf2);


    var ctline_c1_vnf3 = node(routerX - 290, routerY + 50, 'map_data_point_blue.png', '');
    var daline_c1_vnf3 = node(routerX - 280, routerY + 30, 'map_data_point_blue.png', '');
    newFoldLink(c1_vnf_3, ctline_c1_vnf3);
    newFoldLink(c1_vnf_3, daline_c1_vnf3);


    var ctline_gateway1 = node(routerX - 180, routerY + 50, 'map_data_point_blue.png', '');
    var daline_gateway1 = node(routerX - 190, routerY + 30, 'map_data_point_blue.png', '');
    newFoldLink(gateway1, ctline_gateway1);
    newFoldLink(gateway1, daline_gateway1);

    container.add(c1_vnf_1);
    container.add(c1_vnf_2);
    container.add(c1_vnf_3);
    container.add(gateway1);
    container.add(ctline_c1_vnf1);
    container.add(daline_c1_vnf1);
    container.add(ctline_c1_vnf2);
    container.add(daline_c1_vnf2);
    container.add(ctline_c1_vnf3);
    container.add(daline_c1_vnf3);
    container.add(ctline_gateway1);
    container.add(daline_gateway1);
    container.add(ctrl_line.nodeA);
    container.add(ctrl_line.nodeZ);
    container.add(data_line.nodeA);
    container.add(data_line.nodeZ);

    scene.add(container);


    var ctline_c2_vnf1 = node(routerX + 320, routerY + 30, 'map_data_point_blue.png', '');
    var daline_c2_vnf1 = node(routerX + 310, routerY + 50, 'map_data_point_blue.png', '');
    newFoldLink(c2_vnf_1, ctline_c2_vnf1);
    newFoldLink(c2_vnf_1, daline_c2_vnf1);

    var ctline_c2_vnf2 = node(routerX + 370, routerY + 30, 'map_data_point_blue.png', '');
    var daline_c2_vnf2 = node(routerX + 360, routerY + 50, 'map_data_point_blue.png', '');
    newFoldLink(c2_vnf_2, ctline_c2_vnf2);
    newFoldLink(c2_vnf_2, daline_c2_vnf2);


    var ctline_c2_vnf3 = node(routerX + 420, routerY + 30, 'map_data_point_blue.png', '');
    var daline_c2_vnf3 = node(routerX + 410, routerY + 50, 'map_data_point_blue.png', '');
    newFoldLink(c2_vnf_3, ctline_c2_vnf3);
    newFoldLink(c2_vnf_3, daline_c2_vnf3);


    var ctline_gateway2 = node(routerX + 240, routerY + 30, 'map_data_point_blue.png', '');
    var daline_gateway2 = node(routerX + 230, routerY + 50, 'map_data_point_blue.png', '');
    newFoldLink(gateway2, ctline_gateway2);
    newFoldLink(gateway2, daline_gateway2);

    container2.add(c2_vnf_1);
    container2.add(c2_vnf_2);
    container2.add(c2_vnf_3);
    container2.add(gateway2);
    container2.add(ctline_c2_vnf1);
    container2.add(daline_c2_vnf1);
    container2.add(ctline_c2_vnf2);
    container2.add(daline_c2_vnf2);
    container2.add(ctline_c2_vnf3);
    container2.add(daline_c2_vnf3);
    container2.add(ctline_gateway2);
    container2.add(daline_gateway2);
    container2.add(ctrl_line_2.nodeA);
    container2.add(ctrl_line_2.nodeZ);
    container2.add(data_line_2.nodeA);
    container2.add(data_line_2.nodeZ);

    scene.add(container2);
    stage.add(scene);
  });
}])