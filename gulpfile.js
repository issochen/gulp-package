/*引入gulp及相关插件 require('node_modules里对应模块')*/
var gulp = require('gulp'),
    stylus = require('gulp-stylus'),                      //编译stylus
    cleanCss = require('gulp-clean-css'),                 // 压缩css
    autoprefixer = require('gulp-autoprefixer'),          // css前缀
    uglify = require('gulp-uglify'),                      //压缩JS
    htmlmin = require('gulp-htmlmin'),                    //压缩html
    rev = require('gulp-rev'),                             // 给文件加入版本号
    revCollector = require('gulp-rev-collector'),         // 替换html中的文件名
    concat = require('gulp-concat'),                       // 合并
    browserSync = require('browser-sync').create(),       // 浏览器运行
    clean = require('gulp-clean'),                       //清空文件夹，避免文件冗余
    imagemin = require('gulp-imagemin'),                  // 压缩图片
    pngquant = require('imagemin-pngquant'),
    del = require('del'),                                // 下面两个就是在管道中 进行文件删除操作
    vinylPaths = require('vinyl-paths');


    const SRC = './src/'   
    const SRC_JS = SRC + 'js'
    const SRC_CSS = SRC + 'css'
    const SRC_IMG = SRC + 'img'
    const SRC_STYLUS = SRC + 'stylus'

    const SRC_JS_ALL = SRC_JS + '/**/*'
    const SRC_CSS_ALL = SRC_CSS + '/**/*'
    const SRC_IMG_ALL = SRC_IMG + '/*.{png,jpg,gif,ico,jpeg}'
    const SRC_HTML_ALL = SRC + '*.html'
    const SRC_STYLUS_ALL = SRC_STYLUS + '/**/*.styl'

    const DIST = './dist/'
    const DIST_JS = DIST + 'js'
    const DIST_CSS = DIST + 'css'
    const DIST_IMG = DIST + 'img'
    const DIST_JS_ALL = DIST_JS + '/**/*'
    const DIST_CSS_ALL = DIST_CSS + '/**/*'
    const DIST_IMG_ALL = DIST_IMG + '/**/*'
    const DIST_HTML_ALL = DIST + '*.html'



// ======== 编译stylus并输出到css目录里
gulp.task('stylusCompile', function() {
    return  gulp.src(SRC_STYLUS_ALL)
            .pipe(stylus({
                compress: false
            }))
            .pipe(autoprefixer({   // 支持到IE9
                browsers: 'last 3 versions' 
            }))
            .pipe(gulp.dest(SRC_CSS))
});
// ========  将css 目录里的所有css文件 压缩
gulp.task('cssMin', function() {
    return  gulp.src(SRC_CSS_ALL)
            // .pipe(concat('xmtcss.min.css'))   // 合并css
            .pipe(cleanCss())
            .pipe(gulp.dest(DIST_CSS))
});

// // ========  压缩js
gulp.task('jsMin', function() {
    return gulp.src(SRC_JS_ALL)
        // .pipe(concat('xmtcss.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(DIST_JS));
});

// // ========  压缩html
gulp.task('htmlMin', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        // collapseBooleanAttributes: true,
        //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        // removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        // removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
      };
    return  gulp.src(SRC_HTML_ALL)
            // .pipe(fileinclude({      // 处理公共Html文件如 底部 和 面包屑等
            //     prefix: '@@',        //变量前缀 @@include
            //     basepath: '@file',   //引用文件路径
            //     indent:true          //保留文件的缩进
            // }))
            .pipe(htmlmin(options))
            .pipe(gulp.dest(DIST));
});






// // ======================================================下面是独立的功能 clean-all-dist
// /*清空文件夹*/
gulp.task('clean-alldist',function(){
	return  gulp.src([DIST_CSS_ALL,DIST_IMG_ALL,DIST_JS_ALL,DIST_HTML_ALL,'./json/**/*.json'],{read: false})
		    .pipe(clean());
});

// // ======================================================下面是独立的功能 MD文件名（js.css）
// /*清空文件夹*/
gulp.task('clean',function(){
	return  gulp.src([DIST_CSS_ALL,DIST_JS_ALL,DIST_HTML_ALL,'./json/**/*.json'],{read: false})
		    .pipe(clean());
});

// /*add dev*/
gulp.task('revCss',function(){
    return gulp.src(DIST_CSS_ALL)  
        .pipe(vinylPaths(del)) //先删除源文件 在进行hash：css
        .pipe(rev())  //文件加入版本号
        .pipe(gulp.dest(DIST_CSS))
		.pipe(rev.manifest())  //对应的版本号和原始文件用json表示出来
		.pipe(gulp.dest('./json/css'));
});
gulp.task('revJs',function(){
    return gulp.src(DIST_JS_ALL)
        .pipe(vinylPaths(del)) //先删除源文件 在进行hash：js
        .pipe(rev())  //文件加入版本号
        .pipe(gulp.dest(DIST_JS))
		.pipe(rev.manifest())  //对应的版本号和原始文件用json表示出来
		.pipe(gulp.dest('./json/js'));
});

gulp.task('dev',function(){
	return gulp.src(['json/**/*.json',DIST_HTML_ALL])
		.pipe(revCollector({
			 replaceReved: true
		}))
		.pipe(gulp.dest(DIST));
});
// // ======================================================下面是独立的功能 压缩图片
gulp.task('minImg', () =>
    gulp.src(SRC_IMG_ALL)
        .pipe(imagemin({ 
          svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
          optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
          progressive: true,  //类型：Boolean 默认：false 无损压缩jpg图片
          interlaced: true,  //类型：Boolean 默认：false 隔行扫描gif进行渲染
          multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
          use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(DIST_IMG))
);



// // =========  开发环境  并 监听文件变化 实时刷新 浏览器
gulp.task('watcher',gulp.series('clean-alldist',"stylusCompile",'cssMin','jsMin','htmlMin', "minImg", function() {
    console.log('运行在localhost: 8080端口');
    browserSync.init({   // 开启浏览器   
        port: 8080,      // 端口号
        server: {
            baseDir: './dist',  // 主目录
            index: '/index.html'  // 入口html
        },
        //open: true,        // 是否自动打开浏览器   默认 true
        //browser: 'google chrome'     // 指定打开浏览器   打开多个浏览器 ['Safari', 'google chrome']    
    })
    // 实时监视哪些文件的变动，变动之后 则 重载 浏览器
    gulp.watch(SRC_STYLUS_ALL, gulp.series('stylusCompile', 'cssMin')).on('change', browserSync.reload)
    gulp.watch(SRC_HTML_ALL, gulp.series('htmlMin')).on('change', browserSync.reload)
    gulp.watch(SRC_JS_ALL, gulp.series('jsMin')).on('change', browserSync.reload)
}))

// =========  发布线上版本 并添加版本号 更改html 引用
gulp.task('default', gulp.series("clean-alldist", "stylusCompile", "cssMin", "jsMin", "htmlMin", "minImg", "revCss", "revJs", "dev"))

