app.controller('perCtrl', function ($scope) {

});

app.controller('alarmGridCtrl', ['$scope','$log', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',
    function ($scope,$log, $http, $timeout, $interval) {
        $scope.selectedRows = new Array();
        var mydefalutData = [
            {name: "shebei1", Id: "22", State: '1', Cpu: "40%", Memory: "60,0", Disk: "60,000", Network: "60,000"},
            {name: "shebei1", Id: "226", State: '2', Cpu: "40%", Memory: "60", Disk: "60,", Network: "60,000"},
            {
                name: "shebei1",
                Id: "225",
                State: '2',
                Cpu: "40%",
                Memory: "60,000",
                Disk: "60,000",
                Network: "60,000"
            },
            {name: "shebei1", Id: "224", State: '3', Cpu: "40%", Memory: "600", Disk: "60,000", Network: "60,000"},

            {
                name: "shebei1",
                Id: "223",
                State: '2',
                Cpu: "40%",
                Memory: "60,000",
                Disk: "60,000",
                Network: "60,000"
            },
            {
                name: "shebei1",
                Id: "221",
                State: '3',
                Cpu: "40%",
                Memory: "60,000",
                Disk: "60,000",
                Network: "60,000"
            }

        ];
		 $scope.items = [
			'The first choice!',
			'And another choice for you.',
			'but wait! A third!'
		  ];
		
		$scope.toggled = function(open) {
			$log.log('Dropdown is now: ', open);
		};
		
		$scope.status = {
			isopen: false
		};
		
		$scope.toggleDropdown = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.status.isopen = !$scope.status.isopen;
		};
		
		$scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
        $scope.gridOptions = {
            data: 'myData',
            columnDefs: [{
                field: 'name',
                displayName: 'name',
                width: '8%',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                suppressRemoveSort: true,
                enableCellEdit: false // 是否可编辑
            },
                {field: "Id"},
                {field: "State",cellFilter:'mapGender'},
                {field: "Cpu"},
                {field: "Memory"},
                {field: "Disk"},
                {field: "Network"},
                {field: "Action",   cellTemplate :
				'<div uib-dropdown style="position: absolute;padding-left: 4%;"><button id="btn-append-to-single-button" type="button" style="padding:0;"  class="btn btn-primary" uib-dropdown-toggle>Action<span class="caret"></span></button><ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="btn-append-to-single-button"><li role="menuitem"><a href="#">1</a></li><li role="menuitem"><a href="#">2</a></li><li role="menuitem"><a href="#">3</a></li></ul></div>'
				, enableCellEdit:false},
            ],
            enableSorting: true, //是否排序
            useExternalSorting: false, //是否使用自定义排序规则
            enableGridMenu: true, //是否显示grid 菜单
            showGridFooter: true, //是否显示grid footer
            enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
            enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示
            enableFiltering: true,
            //-------- 分页属性 ----------------
            enablePagination: true, //是否分页，默认为true
            enablePaginationControls: true, //使用默认的底部分页
            paginationPageSizes: [10, 15, 20], //每页显示个数可选项
            paginationCurrentPage: 1, //当前页码
            paginationPageSize: 10, //每页显示个数
            //paginationTemplate:"<div></div>", //自定义底部分页代码
            totalItems: 0, // 总数量
            useExternalPagination: true,//是否使用分页按钮


            //----------- 选中 ----------------------
            enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
            enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
            enableRowHeaderSelection: true, //是否显示选中checkbox框 ,默认为true
            enableRowSelection: false, // 行选择是否可用，默认为true;
            enableSelectAll: true, // 选择所有checkbox是否可用，默认为true;
            enableSelectionBatchEvent: true, //默认true
            isRowSelectable: function (row) { //GridRow
                /* if(row.entity.age > 45){
                     row.grid.api.selection.selectRow(row.entity); // 选中行
                 }*/
            },
            modifierKeysToMultiSelect: false,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
            multiSelect: true,// 是否可以选择多个,默认为true;
            noUnselect: false,//默认false,选中后是否可以取消选中
            selectionRowHeaderWidth: 20,//默认30 ，设置选择列的宽度；


            //---------------api---------------------
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                //分页按钮事件
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if (getPage) {
                        getPage(newPage, pageSize);
                    }
                });
                //行选中事件
                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
                    if (row) {
                        var num = $.inArray(row.entity.Id, $scope.selectedRows);
                        if (num == -1) {
                            $scope.selectedRows.push(row.entity.Id);
                        }
                        else {
                            $scope.selectedRows.splice(num, 1);
                        }
                    }
                });
                $scope.gridApi.grid.registerRowsProcessor( $scope.singleFilter, 200 );
            }
        };

        var getPage = function (curPage, pageSize) {
            var firstRow = (curPage - 1) * pageSize;
            $scope.gridOptions.totalItems = mydefalutData.length;
            $scope.gridOptions.data = mydefalutData.slice(firstRow, firstRow + pageSize);
            //或者像下面这种写法
            //$scope.myData = mydefalutData.slice(firstRow, firstRow + pageSize);
        };
        getPage(1, $scope.gridOptions.paginationPageSize);

        $scope.trashcan = function () {
            alert('delete ' + $scope.selectedRows);
        };

        $scope.status = [
            {id: 1, name: 'danger', count: 10},
            {id: 2, name: 'alarm', count: 8},
            {id: 3, name: 'normal', count: 7},
            {id: undefined, name: 'All', count: 7}
        ];



        $scope.selectStatus = function (v) {
            $scope.selectedStatus = v;
            $scope.gridApi.grid.refresh();
        };
        $scope.activeStatus = function (status_id) {

            return status_id == $scope.selectedStatus;
        };

        $scope.singleFilter = function (renderableRows) {
            var matcher = new RegExp($scope.selectedStatus);
            renderableRows.forEach(function (row) {
                var match = false;
                ['State'].forEach(function (field) {
                    if (row.entity[field].match(matcher)) {
                        match = true;
                    }
                });
                if (!match) {
                    row.visible = false;
                }
            });
            return renderableRows;
        };
//input框
$scope.menuState={show: false}
 $scope.toggleMenu=function()
 {
	 $scope.menuState.show=!$scope.menuState.show;
 }
 //切换框
  $scope.singleModel = 1;

  $scope.radioModel = 'Middle';

  $scope.checkModel = {
   open: false,
    close: true,
  };

  $scope.checkResults = [];

  $scope.$watchCollection('checkModel', function () {
    $scope.checkResults = [];
    angular.forEach($scope.checkModel, function (value, key) {
      if (value) {
        $scope.checkResults.push(key);
      }
    });
  });

    }]).filter('mapGender', function () {
    var genderHash = {
        1: 'danger',
        2: 'alarm' ,
        3: 'normal'
    };

    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    }
	
});