"use strict";
//创建全局变量,.value()创建全局变量
angular.module("app").value("dict",{}).run(["dict","$http",function(dict,$http){
    $http.get("data/area.json").then(function(resp){
        dict.area = resp.data;
    });
    $http.get("data/teacher.json").then(function(resp){
        dict.teacher = resp.data;
    });
    $http.get("data/classroom.json").then(function(resp){
        dict.classroom = resp.data;
    });
}])