var gulp = require("gulp");
var $ = require("gulp-load-plugins")();//实例化调用
var open = require("open");

var app = {
    srcPath:"src/",
    devPath:"bulid/",
    prdPath:"dist/"
}
//定义任务
gulp.task("lib",function(){
    gulp.src("bower_components/**/*")//读取文件,深度遍历文件夹下的所有文件
        //生成目录
        .pipe(gulp.dest(app.devPath +"vendor"))
        .pipe(gulp.dest(app.prdPath +"vendor"))
        .pipe($.connect.reload());
});

gulp.task("html",function(){
    gulp.src(app.srcPath + "**/*.html")
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
});

gulp.task("json",function(){
    gulp.src(app.srcPath+ "data/**/*.json")//读取文件,深度遍历文件夹下的所有文件
        //生成目录
        .pipe(gulp.dest(app.devPath +"data"))
        .pipe(gulp.dest(app.prdPath +"data"))
        .pipe($.connect.reload());
});

gulp.task("less",function(){
    gulp.src(app.srcPath + "style/index.less")
        .pipe($.less())
        .pipe(gulp.dest(app.devPath +"css"))
        .pipe($.cssmin())//压缩
        .pipe(gulp.dest(app.prdPath +"css"))
        .pipe($.connect.reload());
});

gulp.task("js",function(){
    gulp.src(app.srcPath + "script/**/*.js")
        .pipe($.concat("index.js"))
        .pipe(gulp.dest(app.devPath +"js"))
        .pipe($.uglify())//压缩
        .pipe(gulp.dest(app.prdPath +"js"))
        .pipe($.connect.reload());
});

gulp.task("image",function(){
    gulp.src(app.srcPath + "image/**/*")
        .pipe(gulp.dest(app.devPath +"image"))
        .pipe($.imagemin())//压缩
        .pipe(gulp.dest(app.prdPath +"image"))
        .pipe($.connect.reload());
});
gulp.task("bulid",["image","js","less","lib","html","json"]);

gulp.task("clean",function(){
    gulp.src([app.devPath,app.prdPath])
        .pipe($.clean());
});

gulp.task("server",["bulid"],function(){
    $.connect.server({
        root:[app.devPath],
        livereload:true,
        port:1234
    });
    open("http://localhost:1234");

    gulp.watch(app.srcPath + "script/**/*.js",["js"]);
    gulp.watch("bower_components/**/*",["lib"]);
    gulp.watch(app.srcPath + "**/*.html",["html"]);
    gulp.watch(app.srcPath+ "data/**/*.json",["json"]);
    gulp.watch(app.srcPath + "style/**/*.less",["less"]);
    gulp.watch(app.srcPath + "image/**/*",["image"]);
});

gulp.task("default",["server"]);