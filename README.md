略完整的gulp封装, 基于gulp4, 功能主要包含 html、 css、 js 、image 压缩,  stylus编译, 开发环境, 线上环境。
不了解gulp4的, 点击这里**[走进gulp4的世界](https://blog.csdn.net/jianjianjianjiande/article/details/79048778)**

## 一. 准备工作
### 1. 全局安装gulp
```
npm install -g gulp
```
### 2. 项目开发依赖安装
```
npm install --save-dev gulp
```
### 3. 注意
> * 在执行gulp任务时报错误, 请检查全局 gulp 与开发依赖 gulp 版本是否一致
> * package.json里     "gulp": "^4.0.0"
> * gulp -v             Local version 4.0.0 
## 二. 详情目录结构
### 1. 项目结构
![项目结构](http://39.108.187.95/blog-resources/gulp/dir.png)

### 2. package.json 配置
![package.json](http://39.108.187.95/blog-resources/gulp/package.png)

## 三. gulp 详细配置
### 1. 安装相关插件
```
npm install --save-dev gulp-stylus gulp-clean-css gulp-autoprefixer gulp-uglify gulp-htmlmin gulp-rev gulp-rev-collector gulp-concat browser-sync gulp-clean gulp-imagemin imagemin-pngquant del vinyl-paths
```
