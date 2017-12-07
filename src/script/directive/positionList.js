"use strict"
angular.module("app").directive("appPositionList",["$http","cache",function($http,cache){
    return{
        restrict:"A",
        replace: true,
        templateUrl:"view/template/positionList.html",
        scope:{
        //与控制器共享scope，暴露data接口
            data:'=',
            filterObj:'=',
        },
        link:function($scope){
            $scope.name = cache.get('name') || '';            
            $scope.select = function(item){
                /*$http.post("data/favorite.json",{
                    id:item.id,
                    select:!item.select
                }).success(function(resp){
                item.select = !item.select;
            });*/
                console.log(item.select);
                cache.put('posted'+item.id,cache.get('posted'+item.id) === "true" ?"false":"true");
                item.select = cache.get('posted'+item.id);
                console.log(item.select);
            };
        }
    };
    //制定变量名传递给不同的属性,降低指令与控制器的耦合度 
}])