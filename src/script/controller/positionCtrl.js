"use strict";
//$q 延迟加载服务
angular.module("app").controller("positionCtrl",["$log","$http","$state","$scope","cache",function($log,$http,$state,$scope,cache){
    $scope.isLogin = !!cache.get("name");
    $scope.posted = !!cache.get("posted"+$state.params.id);
    $scope.message = $scope.isLogin?'喜欢收藏':'未登录';
    //$http.get("/data/position.json?id="+$state.params.id)       由于无后端，利用虚拟数据代替,
    $http.get("/data/position/position"+$state.params.id+".json")
         .then(function(resp){
             $scope.position = resp.data;        
            /*if(resp.posted){
                $scope.message = "已收藏";   //无后台数据，用cache模拟
            }*/
           if(cache.get("posted"+$state.params.id) === "true"){
                $scope.message = "已收藏";   //无后台数据，用cache模拟
            }else{
                $scope.message = "喜欢收藏";
            }
            //def.resolve(resp);
            getSchool($scope.position.schoolId);
        })            
    function getSchool(id){
        //$http.get("/data/school.json?id=" + id)
        $http.get("/data/school/school"+$state.params.id+".json")
         .then(function(resp){
            $scope.school = resp.data;
         })
    }
    $scope.go=function(){
       if($scope.isLogin){
            if($scope.message == "已收藏"){
                /*$http.post("data/handle.json",{
                    id:$scope.position.id
                }).success(function(resp){
                   $log.info(resp);*/                
                cache.put("posted"+$state.params.id,false);
                $scope.message = "喜欢收藏";
                $scope.position.select = false;
                //})
            
            }else{
                cache.put("posted"+$state.params.id,true);
                $scope.message = "已收藏";
                $scope.position.select = true;          
            }  
        }else{
                $state.go("login");
            }        
    }
    //getPosition() 
}])