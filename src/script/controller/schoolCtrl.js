"use strict"
angular.module("app").controller("schoolCtrl",["$http","$state","$scope",function($http,$state,$scope){
     //$http.get("/data/company.json?id="+$state.params.id)
     $http.get("/data/school/school"+$state.params.id+".json")
         .then(function(resp){
            $scope.school = resp.data;
         });    
}])