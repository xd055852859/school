"use strict";
angular.module("app").directive("appPositionClass",function(){
    return{
        restrict:"A",
        replace:true,
        templateUrl:"view/template/positionClass.html",
        scope:{
            sch:"="
        },
        link:function($scope){
             $scope.$watch("sch",function(newVal,oldVal){ 
                 if(newVal){
                    $scope.showPositionList(0);
                 }
            });      
            $scope.showPositionList=function(idx){
                $scope.positionList = $scope.sch.positionClass[idx].positionList;
                $scope.isActive = idx; 
            }
        }
    }
})