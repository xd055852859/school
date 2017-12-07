"use strict";
angular.module("app").directive("appSchool",[function(){
    return{
        restrict:"A",
        replace:true,
        templateUrl:"view/template/school.html",
        scope:{
            sch:"="
        }
    }
}])