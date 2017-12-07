"use strict"
angular.module("app").directive("appSheet",[function(){
    return{
        restrict:"A",
        replace: true,
        scope:{
            list:"=",
            visible:"=",
            select:"&"
        },
        templateUrl:"view/template/sheet.html",
    };
    //制定变量名传递给不同的属性,降低指令与控制器的耦合度 
}])