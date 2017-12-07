"use strict"
angular.module("app").controller("mainCtrl",["$http","$scope","cache",function($http,$scope,cache){
    $http.get("/data/positionList.json").then(function(resp){
        $scope.positionList = resp.data;
        if(cache.get("name")){
            for(var i =0;i<$scope.positionList.length;i++){
                $scope.positionList[i].select = cache.get("posted"+i);
                console.log($scope.positionList[i].select);
            }
        }
    });
}])