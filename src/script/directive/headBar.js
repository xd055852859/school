"use strict";
angular.module("app").directive("appHeadBar",[function(){
    return{
        //EAMC
        //E: 以元素的方式
        //A：以属性的形式
        //M：以注释的方式
        //C：以样式的方式
        restrict:"A",
        replace:true,
        templateUrl:"view/template/headBar.html",
        scope:{
            text:"@"
        },
        link:function($scope){
            $scope.back = function(){
                window.history.back();
            }
        }
        
    }
}])