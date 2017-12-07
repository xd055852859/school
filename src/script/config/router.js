"use strict";
//服务配置路口provider
angular.module("app").config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
    $stateProvider.state("main",{
        url:"/main",
        templateUrl:"view/main.html",
        //页面逻辑
        controller:"mainCtrl"
    }).state("position",{
        url:"/position/:id",
        templateUrl:"view/position.html",
        //页面逻辑
        controller:"positionCtrl"
    }).state("school",{
        url:"/school/:id",
        templateUrl:"view/school.html",
        controller:"schoolCtrl"
    }).state("search",{
        url:"/search",
        templateUrl:"view/search.html",
        controller:"searchCtrl"
    }).state("login",{
        url:"/login",
        templateUrl:"view/login.html",
        controller:"loginCtrl"
    }).state("register",{
        url:"/register",
        templateUrl:"view/register.html",
        controller:"registerCtrl"
    }).state("me",{
        url:"/me",
        templateUrl:"view/me.html",
        controller:"meCtrl"
    }).state("favorite",{
        url:"/favorite",
        templateUrl:"view/favorite.html",
        controller:"favoriteCtrl"
    }).state("post",{
        url:"/post",
        templateUrl:"view/post.html",
        controller:"postCtrl"
    });
    //默认跳转
    $urlRouterProvider.otherwise("main");
}])