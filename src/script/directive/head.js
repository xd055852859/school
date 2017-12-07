"use strict";
angular.module("app").directive("appHead",['cache',function(cache){
    return{
        //EAMC 以何种方式调用指令
        //E: 以元素的方式
        //A：以属性的形式
        //M：以注释的方式
        //C：以样式的方式
        restrict:"A",
        replace:true,//替换
        templateUrl:"view/template/head.html",
        link:function($scope){
            $scope.name = cache.get("name") || ''; 
        }
    }
}])