"use strict";
angular.module("app",["ui.router","ngCookies","validation"]);
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
"use strict";
angular.module("app").config(["$provide",function($provide){
   //$q异步,$delegate装饰
   $provide.decorator("$http",["$delegate","$q",function($delegate,$q){
       var get = $delegate.get;
       $delegate.post = function(url,data,config){
           var def =$q.defer();
           $delegate.get(url).then(function(resp){
               def.resolve(resp);
           },function(err){
               def.reject(err);
           });
           return{
               success:function(cb){
                   def.promise.then(cb);
               },
               error:function(cb){
                   def.promise.then(null, cb);
               }
           }          
       }
       return $delegate;
   }]);
}])
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
"use strict";
angular.module("app").config(["$validationProvider",function($validationProvider){
    var expression = {
        phone:/^1[\d]{10}$/,
        password:function(value){
            var str = value + ""
            return str.length > 5;
        },
        required:function(value){
            return !!value;
        }
    };
    var defaultMsg = {
        phone:{
            success:'',
            error:'必须是11位的手机号码'
        },
        password:{
            success:'',
            error:'长度至少6位'
        },
        required:{
            success:'',
            error:'不能为空'
        }
    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}])
"use strict"
angular.module("app").controller("loginCtrl",["cache","$http","$scope","$state",function(cache,$http,$scope,$state){
    $scope.submit = function(){
        $http.post("data/login.json",$scope.user).success(function(resp){
            cache.put("id",resp.data.id);
            cache.put("name",resp.data.name);
            cache.put("image",resp.data.image);
            $state.go("main");
        });
    }   
}])
"use strict"
angular.module("app").controller("mainCtrl",["$http","$scope","cache",function($http,$scope,cache){
    $http.get("/data/positionList.json").then(function(resp){
        $scope.positionList = resp.data;
        if(cache.get("name")){
            for(var i =0;i<$scope.positionList.length;i++){
                $scope.positionList[i].select = cache.get("posted"+i);
                console.log($scope.positionList[i].select);
            }
        }
    });
}])
"use strict"
angular.module("app").controller("meCtrl",["$state","cache","$http","$scope",function($state,cache,$http,$scope){
    if(cache.get("name")){
        $scope.name = cache.get("name");
        $scope.image = cache.get("image");
    }
    $scope.logout = function(){
        cache.remove("id");
        cache.remove("name");
        cache.remove("image");
        $state.go("main");     
    };
}])
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
"use strict"
angular.module("app").controller("postCtrl",["$http","$scope","cache",function($http,$scope,cache){
    $scope.tabList = [{
        id:"all",
        name:"全部"
    },{
        id:"love",
        name:"主要考虑"
    },{
        id:"like",
        name:"次要参考"
    }];
    $http.get("data/positionList.json").then(function(resp){
        $scope.positionList = resp.data;
        $scope.all = $scope.positionList;
        $scope.len= $scope.positionList.length;
        //刷新左边的星星  
        for(var i =0;i<$scope.positionList.length;i++){
            $scope.positionList[i].select = cache.get("posted"+i);
        }   
    });
    $scope.filterObj = {};    
    $scope.tClick = function(id,name){
        switch(id){
           /* case "all":    直接取数据中的state
                delete $scope.filterObj.state;
                break;
            case "love":
                $scope.filterObj.state = "1";
                break;
            case "like":
                $scope.filterObj.state = "-1";
                break;*/
            case "all":
                $scope.list = $scope.all;
                break;
            case "love":
                $scope.list = [];
                for (var i = 0;i<$scope.len;i++){
                    if(cache.get("posted"+i) === "true"){
                        $scope.list.push($scope.all[i]);
                    }
                }               
                break;
            case "like":
                $scope.list = [];
                for (var i = 0;i<$scope.len;i++){                            
                    if(cache.get("posted"+i) === "false"){
                       $scope.list.push($scope.all[i]);
                    }
                }
                break;
            default:
        }
        $scope.positionList = $scope.list;
    }
}])
"use strict";
angular.module("app").controller("registerCtrl",["$interval","$http","$scope","$state",function($interval,$http,$scope,$state){
    $scope.submit = function(){
        //此处的post在http中已修改,必须赢success方法而不是用then
        $http.post("data/regist.json",$scope.user).success(function(resp){
            $state.go("login");
        })
    }
    var count = 60;
    $scope.send = function(){
        $http.get("data/code.json").then(function(resp){
            if(1 === resp.data.state){
                $scope.time = '60s';
                var interval = $interval(function(){
                    if(count<=0){
                        count = 60;
                        $interval.cancel(interval);
                        $scope.time = '';
                        return;
                    }else{
                        count--;
                        $scope.time = count + 's';
                    }                   
                },1000)
            }
        })
    }
}])
"use strict"
angular.module("app").controller("schoolCtrl",["$http","$state","$scope",function($http,$state,$scope){
     //$http.get("/data/company.json?id="+$state.params.id)
     $http.get("/data/school/school"+$state.params.id+".json")
         .then(function(resp){
            $scope.school = resp.data;
         });    
}])
"use strict"
angular.module("app").controller("searchCtrl",["dict","$http","$scope",function(dict,$http,$scope){
    $scope.name = "";   
    $scope.search = function(){
        $http.get("/data/positionList.json").then(function(resp){
            $scope.positionList = resp.data;
        });
    }
    $scope.search();
    $scope.sheet = {};
    $scope.filterObj = {};
    $scope.tabList = [{
        id:"area",
        name:"地区"
    },{
        id:"teacher",
        name:"教师人数"
    },{
        id:"classroom",
        name:"班级数量"
    }];
    var tabId = "";
    $scope.tClick = function(id,name){
        tabId = id;
        //在config里面配置的dict
        $scope.sheet.list = dict[id];      
        $scope.sheet.visible = true;
    };
    $scope.sClick = function(id,name){
        if(id){
            //通过选择弹出菜单来改变上面tab内的内容
            angular.forEach($scope.tabList,function(item){
                if(item.id === tabId){
                    item.name = name;
                }
            });
            //利用ng的过滤器来进行选择
            $scope.filterObj[tabId + "Id"] = id; 
        }else{
            //删除限制条件
            delete $scope.filterObj[tabId + "Id"];
            //点击不限时还原  
            angular.forEach($scope.tabList,function(item){
                if(item.id === tabId){
                    switch (item.id){
                        case 'area':
                            item.name = "地区";
                            break;
                        case 'teacher':
                            item.name = "教师人数";
                            break;
                        case 'classroom':
                            item.name = "班级数量";
                            break;
                        default:
                    }
                }
            });
        }        
    };
}])
"use strict";
angular.module("app").directive("appFoot",[function(){
    return{
        restrict:"A",
        replace:true,
        templateUrl:"view/template/foot.html"
    }
}])
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
"use strict"
angular.module("app").directive("appPositionInfo",["$http",function($http){
    return{
        restrict:"A",
        replace:true,
        templateUrl:"view/template/positionInfo.html",
        scope:{
            isActive:"=",
            isLogin:"=",
            pos:"="
        },
        link:function($scope){           
            $scope.$watch("pos",function(newVal){
                if(newVal){
                    $scope.pos.select = $scope.pos.select || false;
                    $scope.imagePath = $scope.pos.select?"image/star-active.png":"image/star.png"
                }
            })           
            $scope.favorite = function(){
                $http.post("data/favorite.json",{
                    id:$scope.pos.id,
                    select:$scope.pos.select
                }).success(function(resp){
                    $scope.pos.select = !$scope.pos.select;
                    $scope.imagePath = $scope.pos.select?"image/star-active.png":"image/star.png"
                });
            }
        }
    }
}])
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
"use strict"
angular.module("app").directive("appTab",[function(){
    return{
        restrict:"A",
        replace: true,
        scope:{
            list:"=",
            tabClick:"&"
        },
        templateUrl:"view/template/tab.html",
        link:function($scope){          
            $scope.click = function(tab){
                $scope.selectId = tab.id;
                $scope.tabClick(tab);
            }          
        }
    };
    //制定变量名传递给不同的属性,降低指令与控制器的耦合度 
}])
"use strict"
angular.module("app").filter("filterByObj",[function(){
    return function(list,obj){
        var result = [];
        angular.forEach(list,function(item){
            var isEqual = true;
            for(var e in obj){
                if(item[e]!==obj[e]){
                    isEqual = false;
                }
            }
            if(isEqual){
                result.push(item);
            }
        });
        return result;
    }
}])
"use strict";
angular.module("app").service("cache",["$cookies",function($cookies){
    this.put = function(key,value){
        $cookies.put(key, value);
    };
    this.get = function(key){
        return $cookies.get(key);
    };
    this.remove = function(key){
        $cookies.remove(key);
    }
}])