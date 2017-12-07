"use strict"
angular.module("app").controller("searchCtrl",["dict","$http","$scope",function(dict,$http,$scope){
    $scope.name = "";   
    $scope.search = function(){
        $http.get("/data/positionList.json").then(function(resp){
            $scope.positionList = resp.data;
        });
    }
    $scope.search();
    $scope.sheet = {};
    $scope.filterObj = {};
    $scope.tabList = [{
        id:"area",
        name:"地区"
    },{
        id:"teacher",
        name:"教师人数"
    },{
        id:"classroom",
        name:"班级数量"
    }];
    var tabId = "";
    $scope.tClick = function(id,name){
        tabId = id;
        //在config里面配置的dict
        $scope.sheet.list = dict[id];      
        $scope.sheet.visible = true;
    };
    $scope.sClick = function(id,name){
        if(id){
            //通过选择弹出菜单来改变上面tab内的内容
            angular.forEach($scope.tabList,function(item){
                if(item.id === tabId){
                    item.name = name;
                }
            });
            //利用ng的过滤器来进行选择
            $scope.filterObj[tabId + "Id"] = id; 
        }else{
            //删除限制条件
            delete $scope.filterObj[tabId + "Id"];
            //点击不限时还原  
            angular.forEach($scope.tabList,function(item){
                if(item.id === tabId){
                    switch (item.id){
                        case 'area':
                            item.name = "地区";
                            break;
                        case 'teacher':
                            item.name = "教师人数";
                            break;
                        case 'classroom':
                            item.name = "班级数量";
                            break;
                        default:
                    }
                }
            });
        }        
    };
}])