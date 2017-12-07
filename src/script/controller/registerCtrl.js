"use strict";
angular.module("app").controller("registerCtrl",["$interval","$http","$scope","$state",function($interval,$http,$scope,$state){
    $scope.submit = function(){
        //此处的post在http中已修改,必须赢success方法而不是用then
        $http.post("data/regist.json",$scope.user).success(function(resp){
            $state.go("login");
        })
    }
    var count = 60;
    $scope.send = function(){
        $http.get("data/code.json").then(function(resp){
            if(1 === resp.data.state){
                $scope.time = '60s';
                var interval = $interval(function(){
                    if(count<=0){
                        count = 60;
                        $interval.cancel(interval);
                        $scope.time = '';
                        return;
                    }else{
                        count--;
                        $scope.time = count + 's';
                    }                   
                },1000)
            }
        })
    }
}])