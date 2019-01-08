function Swiper() {
  this.wrapperEle = document.getElementById("wrapper")  // 展示 轮播图 盒子
  this.swiperEle = this.wrapperEle.getElementsByClassName("slider-content")[0]  //  轮播的 整体大盒子
  this.itemNum = null //  轮播 元素 个数
  this.firstItem = null // 轮播元素中的 第一个元素
  this.lastItem = null  // 轮播元素中的 最后一个元素
  this.wrapperWidth = null  // 展示 轮播图盒子的 宽度
  this.timer = null  //  轮播定时器
  this.num = 1  //  轮播到那个item
  this.paginationItem = null // 分页小点
  this.pagination = false // 是否显示分页 小圆点
  this.leftBtn = null // 左边按钮
  this.rightBtn = null // 右边按钮
}
Swiper.prototype = {
  init : function(opt) {  //初始化 方法  
    this.wrapperWidth = parseInt(this.getStyle(this.wrapperEle, 'width'))  //获取展示盒子的 宽度
    this.itemNum = this.swiperEle.children.length  // 获取 轮播元素 个数
    this.firstItem = this.swiperEle.children[0]   // 获取 轮播元素中的第一个元素
    this.lastItem = this.swiperEle.children[this.itemNum-1]  // 获取轮播元素中的最后一个元素
    this.wrapperEle.style.position = "relative"
    this.swiperEle.style.width = this.wrapperWidth * (this.itemNum + 2) + "px" // 初始化 轮播整体盒子的宽度 和高度
    this.swiperEle.style.height = '100%'
    this.swiperEle.style.position = "absolute"
    this.swiperEle.style.left = -this.wrapperWidth + "px"

    for(var i = 0; i< this.itemNum; i++) {
      this.swiperEle.children[i].style.float = "left"
      this.swiperEle.children[i].style.width = this.wrapperWidth + "px"
      this.swiperEle.children[i].style.height = "100%"
    }
    this.swiperEle.insertBefore(this.lastItem.cloneNode(true), this.firstItem) // 分别 在头部和尾部添加 最后一个元素和第一个元素
    this.swiperEle.appendChild(this.firstItem.cloneNode(true))
    if (!opt.autoplay) opt.autoplay = false  // 默认 不自动轮播
    if (!opt.delay) opt.delay = 3000  // 默认 轮播时间为 3s
    if (!opt.pagination) opt.pagination = false // 默认不显示 分页 小圆点
    if (!opt.navigator) opt.navigator = false // 默认不显示前后退按钮
    if (opt.autoplay){ // 开启 自动轮播 
      this.autoPlay(this.swiperEle, this.wrapperWidth, opt.delay)  // 调用轮播方法
      this.mouseover(this.swiperEle, this.wrapperWidth, opt.delay)  // 调用鼠标滑过方法 滑入 暂停 滑出 开启
    }
    if (opt.pagination) {
      this.pagination = opt.pagination
      var oPaginationWrapper = document.createElement('p')
      var oPagination = document.createElement('ul')
      for (var i = 0; i < this.itemNum; i++) {
        var oPaginationItem = document.createElement('li')
        oPaginationItem.className = "pagination-item"
        oPaginationItem.style.float = "left"
        oPaginationItem.style.width = "12px"
        oPaginationItem.style.height = "12px"
        oPaginationItem.style.marginRight = "10px"
        oPaginationItem.style.borderRadius = "50%"
        oPaginationItem.style.background = "#fff"
        if (i === 0) oPaginationItem.style.background = "#000"
        oPagination.appendChild(oPaginationItem)
      }

      oPagination.className = "pagination"
      oPaginationWrapper.style.height = "30px"
      oPaginationWrapper.style.width = "100%"
      oPaginationWrapper.style.position = "absolute"
      oPaginationWrapper.style.bottom = "20px"
      oPagination.style.position = "absolute"
      oPagination.style.left = "50%"
      let w = this.itemNum * 22
      oPagination.style.marginLeft = -w + "px"
      oPaginationWrapper.appendChild(oPagination)
      this.wrapperEle.appendChild(oPaginationWrapper)
      this.paginationItem = document.getElementsByClassName('pagination-item')
      // 调用 小圆点 点击 切换 轮播图 
      this.paginationClick(this.swiperEle, this.wrapperWidth)
    }
    if (opt.navigator) {
      var leftBtn = document.createElement('div')
      var rightBtn = document.createElement('div')
      leftBtn.innerHTML = "<"
      rightBtn.innerHTML = ">"
      leftBtn.className = "left-btn"
      rightBtn.className = "right-btn"
      leftBtn.style.position = rightBtn.style.position= 'absolute'
      leftBtn.style.top = rightBtn.style.top= '50%'
      leftBtn.style.left= '0' 
      rightBtn.style.right= '0'
      leftBtn.style.width = rightBtn.style.width= '40px'
      leftBtn.style.height = rightBtn.style.height= '80px'
      leftBtn.style.marginTop = rightBtn.style.marginTop= '-40px'
      leftBtn.style.color = rightBtn.style.color= '#fff'
      leftBtn.style.textAlign = rightBtn.style.textAlign= 'center'
      leftBtn.style.fontSize = rightBtn.style.fontSize= '60px'
      leftBtn.style.lineHeight = rightBtn.style.lineHeight= '70px'
      leftBtn.style.cursor = rightBtn.style.cursor= 'pointer'
      leftBtn.style.background = rightBtn.style.background= 'rgba(0, 0, 0, .5)'
      this.wrapperEle.appendChild(leftBtn)
      this.wrapperEle.appendChild(rightBtn)
      this.leftBtn = leftBtn
      this.rightBtn = rightBtn
      this.navigatorClick(this.swiperEle, this.wrapperWidth)
    }
  },
  navigatorClick: function(ele, w) {
    var _this = this
    this.leftBtn.onclick = function() {
      _this.num --
      if(_this.num < 0){
        _this.num = _this.itemNum - 1
        _this.swiperEle.style.left = -w * (_this.num+1) + "px"
      }
      for(var i = 0; i< _this.itemNum; i++) {
        _this.paginationItem[i].style.background = '#fff'
      }
      if (_this.num === 0) {
        _this.paginationItem[_this.itemNum-1].style.background = "#000"
      }else {
        _this.paginationItem[_this.num-1].style.background = "#000"
      }
      _this.sport(ele, {"left": -w * _this.num})
    }
    this.rightBtn.onclick = function() {
      _this.num ++
      if (_this.num === 6) {
        _this.num = 1
        _this.swiperEle.style.left = 0
      }
      
      for(var i = 0; i< _this.itemNum; i++) {
        _this.paginationItem[i].style.background = '#fff'
      }
      _this.paginationItem[_this.num-1].style.background = "#000"
      _this.sport(ele, {"left": -w * _this.num})
    }
  },
  paginationClick: function(ele, w) {
    var _this = this
    for (var i = 0; i < this.itemNum; i++) {
      this.paginationItem[i].index = i
      this.paginationItem[i].onclick = function() {
        _this.num = this.index + 1
        _this.sport(ele, {"left": -w * _this.num})
        for (var j = 0; j< _this.itemNum; j++) {
          _this.paginationItem[j].style.background = '#fff'
        }
        _this.paginationItem[this.index].style.background = "#000"
      }
    }
  },
  autoPlay: function(ele, w, delay) {
    var _this = this
    this.timer = setInterval(this.move.bind(this, ele, w), delay)
  },
  move: function(ele, w) {  // 轮播方法
      this.num ++ 
      if (this.num > 6) {
        this.num = 2
        this.swiperEle.style.left = -this.wrapperWidth + "px"
      }
      if (this.pagination) {
        for (var i = 0; i < this.itemNum; i++) {
          this.paginationItem[i].style.background = "#fff"
          this.paginationItem[i].className = 'pagination-item'
        }
        if(this.num-1 === this.itemNum) {
          this.paginationItem[0].style.background = "#000"
          this.paginationItem[0].className = 'pagination-item active-pagination-item'
        } else {
          this.paginationItem[this.num-1].style.background = "#000"
          this.paginationItem[this.num-1].className = 'pagination-item active-pagination-item'
        }
      }
      
      this.sport(ele, {"left": -w * this.num})
  },
  mouseover: function(ele, w, delay) {
    var _this = this
    this.wrapperEle.onmouseover = function () {
      clearInterval(_this.timer)
    }
    this.wrapperEle.onmouseout = function () {
      _this.timer = setInterval(_this.move.bind(_this, ele, w), delay)
    }
  },
  getStyle: function(ele, attr) {
    return ele.currentStyle? ele.currentStyle[attr] : getComputedStyle(ele)[attr]
  },
  sport: function(ele, json, callback) {
    clearInterval(ele.timer)
    var _this = this
    ele.timer = setInterval(function(){
      let flag = true // 判断 是否 到达 目标值
      for (var attr in json) {  // 遍历 传入的 json 
        if (attr === 'opacity') {
          var cur = _this.getStyle(ele, attr) * 1000
        } else {
          var cur = parseInt(_this.getStyle(ele, attr))
        }
        var speed = (json[attr] - cur)/10
        speed = speed > 0? Math.ceil(speed) : Math.floor(speed)
        if (cur !== json[attr]) flag = false
        if (attr === "opacity") {
          ele.style[attr] = (cur + speed) / 1000
        } else {
          ele.style[attr] = cur + speed + "px"
        }
      }
      if (flag) {
        clearInterval(ele.timer)
        callback && callback()
      }
    }, 30)

  }
}