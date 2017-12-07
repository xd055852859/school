"use strict"
angular.module("app").controller("postCtrl",["$http","$scope","cache",function($http,$scope,cache){
    $scope.tabList = [{
        id:"all",
        name:"全部"
    },{
        id:"love",
        name:"主要考虑"
    },{
        id:"like",
        name:"次要参考"
    }];
    $http.get("data/positionList.json").then(function(resp){
        $scope.positionList = resp.data;
        $scope.all = $scope.positionList;
        $scope.len= $scope.positionList.length;
        //刷新左边的星星  
        for(var i =0;i<$scope.positionList.length;i++){
            $scope.positionList[i].select = cache.get("posted"+i);
        }   
    });
    $scope.filterObj = {};    
    $scope.tClick = function(id,name){
        switch(id){
           /* case "all":    直接取数据中的state
                delete $scope.filterObj.state;
                break;
            case "love":
                $scope.filterObj.state = "1";
                break;
            case "like":
                $scope.filterObj.state = "-1";
                break;*/
            case "all":
                $scope.list = $scope.all;
                break;
            case "love":
                $scope.list = [];
                for (var i = 0;i<$scope.len;i++){
                    if(cache.get("posted"+i) === "true"){
                        $scope.list.push($scope.all[i]);
                    }
                }               
                break;
            case "like":
                $scope.list = [];
                for (var i = 0;i<$scope.len;i++){                            
                    if(cache.get("posted"+i) === "false"){
                       $scope.list.push($scope.all[i]);
                    }
                }
                break;
            default:
        }
        $scope.positionList = $scope.list;
    }
}])