class FullPage{
  constructor (el) {
    this.ele = null   // 传递进 需要滚屏的 父元素
    this.totalY = null // 屏幕 总 高度
    this.startY = null // 手指初始位置
    this.moveY = null // 手指 移动位置
    this.y = null //  屏幕滑动距离
    this.num = 1  // 当前所在 第几屏
    this.totalPage = null //  总的 屏幕数
    this.direction = true //  判断 手指滑动方向 true  往下滑  false  往上滑
    this.init (el)  // 自动调用 初始化 方法
  }
  init (el) {  // 初始化 滚屏
    if (el.indexOf('#') !== -1 ) {
      el = el.subString(1)
      this.ele = document.getElementById(el)
    } else if (el.indexOf('.') !== -1) {
      el = el.substring(1)
      this.ele = document.getElementsByClassName(el)[0]
    } else {
      this.ele = document.getElementsByTagName(el)[0]
    }
    this.totalY = document.documentElement.clientHeight || document.body.clientHeight
    // console.log(this.ele.children.length)
    this.totalPage = this.ele.children.length
    this.ele.addEventListener('touchstart', this.touchStart.bind(this))
    this.ele.addEventListener('touchmove', this.touchMove.bind(this))
    this.ele.addEventListener('touchend', this.touchEnd.bind(this))
  }
  touchStart (ev) {
    const e = ev || window.event
    this.startY = e.touches[0].clientY
  }
  touchMove (ev) {
    const e = ev || window.event
    this.moveY = e.touches[0].clientY
    //判断 往下滑还是往上滑
    if (this.moveY < this.startY) {
        this.direction = false
    } else {
      this.direction = true
    }
    if (this.direction && this.num === 1) {  // 在第一屏 且 往下滑
      this.y = this.moveY - this.startY
      if (this.y > 300) this.y = 300
      this.ele.style.transform = `translateY(${this.y}px)`
    } else if(!this.direction && this.num !== this.totalPage){  // 不在 最后一屏 且往上滑
      this.y =  this.num > 1 ? this.startY - this.moveY + this.totalY* (this.num-1) : this.startY - this.moveY
      // console.log(this.y)
      this.ele.children[this.num].style.transition = ''
      this.ele.children[this.num].style.transform = `translateY(-${this.y}px)`
    } else if ( !this.direction && this.num === this.totalPage ) { //最后一屏 且往上滑
      this.y = this.moveY - this.startY
      if (this.y < -300) this.y = -300
      this.ele.style.transform = `translateY(${this.y}px)`
    } else if (this.direction && this.num !== 1) { // 不在第一屏 且 往下滑
      this.y = this.num > 1 ? this.totalY * (this.num - 1) - this.moveY + this.startY : this.totalY - this.moveY + this.startY
      this.ele.children[this.num - 1].style.transition = ''
      this.ele.children[this.num - 1].style.transform = `translateY(-${this.y}px)`
    }
  }
  touchEnd (ev) {
    const e = ev || window.event
    if (this.direction && this.num === 1) { // 在第一屏 且往下滑 停止
      this.ele.style.transform = `translateY(0)`
    } else if (!this.direction && this.num !== this.totalPage) {// 不在 最后一屏 且往上滑
      let i = this.num
      let scrollY = this.num > 1 ? this.y - this.totalY * (this.num - 1) : this.y
      if ( scrollY > this.totalY * 0.3) {
        this.y = this.totalY * (this.num )
        this.num ++
      } else {
        this.y = 0
      }
      this.ele.children[i].style.transition = 'all .5s'
      this.ele.children[i].style.transform = `translateY(-${this.y}px)`
    } else if ( !this.direction && this.num === this.totalPage ) {//最后一屏 且往上滑
      this.ele.style.transform = 'translateY(0)'
    } else if (this.direction && this.num !== 1) { // 不在第一屏 且 往下滑
      let i = this.num - 1
      let scrollY = this.num > 1 ? this.y - this.totalY * (this.num - 1) : this.y
      if (scrollY < -this.totalY * 0.2){
        this.y = 0
        this.num --
      } else {
        this.y = this.totalY * (this.num - 1)
      }
      this.ele.children[i].style.transition = 'all .5s'
      this.ele.children[i].style.transform = `translateY(-${this.y}px)`
      
    }
  }
}