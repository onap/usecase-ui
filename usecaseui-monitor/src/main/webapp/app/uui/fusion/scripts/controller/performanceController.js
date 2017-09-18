app.controller('perCtrl',function ($scope) {

});
app.controller('perGridCtrl',  ['$scope', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants',
    function ($scope, $http, $timeout, $interval) {

        var mydefalutData = [
		    { name: "Moroni", age: 50, birthday: "Oct 28, 1970", salary: "60,000" },
            { name: "shebei1", Id: "22", State: 50, Cpu: "40%", Memory: "60,0", Disk: "60,000", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "60", Disk: "60,", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "60,000", Disk: "60,000", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "600", Disk: "60,000", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "60,000", Disk: "60,000", Network: "60,000" },
            { name: "shebei1", State: 50, Cpu: "40%", Memory: "60,000", Disk: "60,000", Network: "60,000" }
    ];

        $scope.gridOptions = {
            data: 'myData',
            columnDefs: [{ field: 'name',
                displayName: 'name',
                width: '10%',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: false,
                suppressRemoveSort: true,
                enableCellEdit: false ,// 是否可编辑
				cellTemplate:'<a href  ng-repeat=" data in mydefalutData">{{data.name}}</a>',
            },
                { field: "Id",},
                { field: "State"},
                { field: "Cpu"},	
                { field: "Memory"},
                { field: "Disk"},
                { field: "Network"}
            ],

            enableSorting: true, //是否排序
            useExternalSorting: false, //是否使用自定义排序规则
            enableGridMenu: true, //是否显示grid 菜单
            showGridFooter: true, //是否显示grid footer
            enableHorizontalScrollbar :  1, //grid水平滚动条是否显示, 0-不显示  1-显示
            enableVerticalScrollbar : 0, //grid垂直滚动条是否显示, 0-不显示  1-显示
            enableFiltering: true,
            //-------- 分页属性 ----------------
            enablePagination: true, //是否分页，默认为true
            enablePaginationControls: true, //使用默认的底部分页
            paginationPageSizes: [10, 15, 20], //每页显示个数可选项
            paginationCurrentPage:1, //当前页码
            paginationPageSize: 10, //每页显示个数
            //paginationTemplate:"<div></div>", //自定义底部分页代码
            totalItems : 0, // 总数量
            useExternalPagination: true,//是否使用分页按钮


            //----------- 选中 ----------------------
            enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
            enableFullRowSelection : true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
            enableRowHeaderSelection : true, //是否显示选中checkbox框 ,默认为true
            enableRowSelection : true, // 行选择是否可用，默认为true;
            enableSelectAll : true, // 选择所有checkbox是否可用，默认为true;
            enableSelectionBatchEvent : true, //默认true
            isRowSelectable: function(row){ //GridRow
                if(row.entity.age > 45){
                    row.grid.api.selection.selectRow(row.entity); // 选中行
                }
            },
            modifierKeysToMultiSelect: false ,//默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
            multiSelect: true ,// 是否可以选择多个,默认为true;
            noUnselect: false,//默认false,选中后是否可以取消选中
            selectionRowHeaderWidth:30 ,//默认30 ，设置选择列的宽度；



            //---------------api---------------------
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                //分页按钮事件
                gridApi.pagination.on.paginationChanged($scope,function(newPage, pageSize) {
                    if(getPage) {
                        getPage(newPage, pageSize);
                    }
                });
                //行选中事件
                $scope.gridApi.selection.on.rowSelectionChanged($scope,function(row,event){
                    if(row){
                        $scope.testRow = row.entity;
                    }
                });
            }
        };

        var getPage = function(curPage, pageSize) {
            var firstRow = (curPage - 1) * pageSize;
            $scope.gridOptions.totalItems = mydefalutData.length;
            $scope.gridOptions.data = mydefalutData.slice(firstRow, firstRow + pageSize);
            //或者像下面这种写法
            //$scope.myData = mydefalutData.slice(firstRow, firstRow + pageSize);
        };

        getPage(1, $scope.gridOptions.paginationPageSize);
		
		//input框
$scope.menuState={show: false}
 $scope.toggleMenu=function()
 {
	 $scope.menuState.show=!$scope.menuState.show;
 }
		
    }]);