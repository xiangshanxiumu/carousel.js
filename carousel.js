/**
 * @author xiangshanxiumu
 * @version 1.00
 */
class Carousel {
    constructor(options) {
        this.targetDom = options.targetDom
        this.style = options.style
        this.images = options.images
        this.autoplay = options.autoplay
        this.control = options.control

        this.init(this.targetDom, this.style, this.images, this.autoplay, this.control)

        this.bindEvent(this.targetDom, this.autoplay)
    }
    /**初始化 */
    init(element, style, images, autoplay, control) {
        /*设置外框样式*/
        this.setStyle(element, style)
        let elementStyle = 'position:relative;overflow:hidden' //外框 相对定位
        element.style.cssText += elementStyle
        /*创建ul 并设置样式*/
        this.ulDom = document.createElement('ul')
        element.appendChild(this.ulDom)
        /*创建li 以及内部HTML 获取img src*/
        images.forEach(ele => {
            this.liDom = document.createElement('li')
            this.liDom.innerHTML = '<a href="#"><img src="' + ele + '"/></a>'
            this.ulDom.appendChild(this.liDom)
            this.setStyle(this.liDom, {
                'list-style': 'none'
            })
        })
        /*获取img节点 设置样式*/
        let imgDoms = this.ulDom.querySelectorAll('img')
        imgDoms.forEach(ele => {
            this.setStyle(ele, {
                width: style.width,
                height: style.height,
                'vertical-align': 'top', // li img 上下排列间隙处理 或 'vertical-algin': 'bottom'
                'display': 'block' // li img 上下排列间隙处理
            })
        })
        /** 创建控制部分的指示点 */
        this.indicationPointUl = document.createElement('ul')
        element.appendChild(this.indicationPointUl)
        // Y轴轮播 指示点外框定位轮播区域右下侧
        if (autoplay.effect == 'slideY') {
            this.setStyle(this.indicationPointUl, {
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                opacity: 0.5
            })
        } else { //其余X轴轮播 指示点外框定位轮播区域 中下位置
            this.setStyle(this.indicationPointUl, {
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translate(-50%)',
                opacity: 0.5
            })
        }
        // 创建指示点li 设置样式
        for (let i = 0; i < this.ulDom.children.length; i++) {
            this.indicationPoint = document.createElement('li')
            this.indicationPoint.setAttribute('value', i)
            this.indicationPointUl.appendChild(this.indicationPoint)
            //据传参 分类设置指示点外形样式
            if (control.indicationPoint == 'circle') { //圆点
                this.setStyle(this.indicationPoint, {
                    'list-style': 'none',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%',
                    float: 'left',
                    'margin-right': '10px',
                    'background-color': '#666'
                })
            } else if (control.indicationPoint == 'square') { //正方形
                this.setStyle(this.indicationPoint, {
                    'list-style': 'none',
                    width: '20px',
                    height: '20px',
                    float: 'left',
                    'margin-right': '10px',
                    'background-color': '#666'
                })
            } else { //长方形
                this.setStyle(this.indicationPoint, {
                    'list-style': 'none',
                    width: '20px',
                    height: '10px',
                    float: 'left',
                    'margin-right': '10px',
                    'background-color': '#666'
                })
            }
        }
        this.indicationPointDoms = this.indicationPointUl.querySelectorAll('li') // 获取所有指示点元素

        /**创建控制部分的左右箭头并设置样式 scroll效果无需箭头控制*/
        //左箭头 或上箭头
        this.prev = document.createElement('span')
        element.appendChild(this.prev)
        //右箭头或下箭头
        this.next = document.createElement('span')
        element.appendChild(this.next)
        //左右箭头
        if (autoplay.effect == 'slideX' || autoplay.effect == 'scrollX' || autoplay.effect == 'fade') {
            this.prev.innerText = '＜'
            this.setStyle(this.prev, {
                position: 'absolute',
                left: '0px'
            })
            this.next.innerText = '＞'
            this.nextLeft = (style.width.substring(0, style.width.length - 2) - 50) + 'px'
            this.setStyle(this.next, {
                position: 'absolute',
                //left: this.nextLeft
                right:'0px'
            })
            this.arrowDoms = element.querySelectorAll('span')
            this.arrowDoms.forEach(ele => {
                this.setStyle(ele, {
                    width: '50px',
                    height: '80px',
                    top: '50%',
                    transform: 'translate(0,-50%)',
                    opacity: 0.5,
                    'font-size': '50px',
                    'font-weight': 'bold',
                    color: '#666',
                    'text-align': 'center',
                    'line-height': '70px',
                    cursor: 'pointer',
                    display: 'none'
                })
            })
        } else { //上下箭头
            this.prev.innerText = '∧'
            this.setStyle(this.prev, {
                position: 'absolute',
                top: '0px'
            })
            this.next.innerText = '∨'
            let nextTop = (style.height.substring(0, style.height.length - 2) - 50) + 'px'
            this.setStyle(this.next, {
                position: 'absolute',
                //top: nextTop
                bottom:'0px'
            })
            this.arrowDoms = element.querySelectorAll('span')
            this.arrowDoms.forEach(ele => {
                this.setStyle(ele, {
                    width: '80px',
                    height: '50px',
                    left: '50%',
                    transform: 'translate(-50%,0)',
                    opacity: 0.5,
                    'font-size': '50px',
                    'font-weight': 'bold',
                    color: '#666',
                    'text-align': 'center',
                    'line-height': '50px',
                    cursor: 'pointer',
                    display: 'none'
                })
            })
        }
        /*据effect效果分类初始化自动轮播 */
        switch (autoplay.effect) {
            case 'slideX':
                this.ulDom.insertBefore(this.ulDom.lastChild.cloneNode(true), this.ulDom.children[0])
                this.ulDom.appendChild(this.ulDom.children[1].cloneNode(true))
                this.singlePicWidth = this.getStyle(this.ulDom.children[0], 'width')
                this.slideLeft = -this.singlePicWidth.substring(0, this.singlePicWidth.length - 2) + 'px'
                this.slideXwidth = this.ulDom.children.length * parseFloat(this.singlePicWidth) + 'px'
                this.setStyle(this.ulDom, {
                    position: 'absolute',
                    width: this.slideXwidth,
                    left: this.slideLeft
                })
                for (let i = 0; i < this.ulDom.children.length; i++) {
                    this.ulDom.children[i].style.cssText += 'float:left'
                }
                this.i = 1
                clearInterval(element.Timer)
                element.Timer = setInterval(() => {
                    for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                        this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                    }
                    this.j = this.i
                    if (this.j > this.indicationPointUl.children.length - 1) {
                        this.j = 0
                    }
                    this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                    this.i++
                    this.slideXLTFT = -this.i * parseFloat(this.singlePicWidth)
                    this.attrAnimation(this.ulDom, 'left', this.slideXLTFT, autoplay.time / 5, () => {
                        if (this.i > this.ulDom.children.length - 2) {
                            this.i = 1
                            this.ulDom.style.left = this.slideLeft
                        }
                    })
                }, autoplay.time)
                break

            case 'slideY':
                this.ulDom.insertBefore(this.ulDom.lastChild.cloneNode(true), this.ulDom.children[0])
                this.ulDom.appendChild(this.ulDom.children[1].cloneNode(true))
                this.singlePicHeight = this.getStyle(this.ulDom.children[0], 'height')
                this.slideYtop = -this.singlePicHeight.substring(0, this.singlePicHeight.length - 2) + 'px'
                this.slideTopDown = -(this.ulDom.children.length - 2) * parseFloat(this.singlePicHeight) + 'px'
                this.setStyle(this.ulDom, {
                    position: 'absolute',
                    width: '100%',
                    top: this.slideYtop
                })
                this.i = 1
                element.Timer = setInterval(() => {
                    this.i--
                    for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                        this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                    }
                    this.j = this.i - 1
                    if (this.j < 0) {
                        this.j = this.indicationPointUl.children.length - 1
                    } else if (this.j > this.indicationPointUl.children.length - 1) {
                        this.j = 0
                    }
                    this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                    this.slideYTOP = -this.i * parseFloat(this.singlePicHeight)
                    this.attrAnimation(this.ulDom, 'top', this.slideYTOP, autoplay.time / 5, () => {
                        if (this.i < 1) {
                            this.i = this.ulDom.children.length - 1
                            this.ulDom.style.top = this.slideTopDown
                        }
                    })
                }, autoplay.time)
                break

            case 'scrollX':
                this.ulDom.insertBefore(this.ulDom.lastChild.cloneNode(true), this.ulDom.children[0])
                this.ulDom.appendChild(this.ulDom.children[1].cloneNode(true))
                this.singlePicWidth = this.getStyle(this.ulDom.children[0], 'width')
                this.scrollXInitXLeft = -this.singlePicWidth.substring(0, this.singlePicWidth.length - 2) + 'px'
                this.scrollXwidth = this.ulDom.children.length * parseFloat(style.width) + 'px'
                this.setStyle(this.ulDom, {
                    position: 'absolute',
                    width: this.scrollXwidth,
                    left: this.scrollXInitXLeft
                })
                for (let i = 0; i < this.ulDom.children.length; i++) {
                    this.ulDom.children[i].style.cssText += 'float:left'
                }
                this.scrollXLEFT = -(this.ulDom.children.length - 1) * parseFloat(style.width)
                element.Timer = setInterval(() => {
                    let currentLeft = parseFloat(this.getStyle(this.ulDom, 'left'))
                    let speed = -parseFloat(this.singlePicWidth) / (autoplay.time / 25)
                    for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                        this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                    }
                    this.i = parseInt(-currentLeft / (this.singlePicWidth.substring(0, this.singlePicWidth.length - 2)))
                    this.j = this.i - 1
                    if (this.j > this.indicationPointUl.children.length - 1) {
                        this.j = 0
                    } else if (this.j < 0) {
                        this.j = this.indicationPointUl.children.length - 1
                    }
                    this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                    this.ulDom.style.left = currentLeft + speed + "px"
                    if (currentLeft <= this.scrollXLEFT) {
                        this.ulDom.style.left = this.scrollXInitXLeft
                    }
                }, 25)
                break

            case 'scrollY':
                this.ulDom.insertBefore(this.ulDom.lastChild.cloneNode(true), this.ulDom.children[0])
                this.ulDom.appendChild(this.ulDom.children[1].cloneNode(true))
                this.singlePicHeight = this.getStyle(this.ulDom.children[0], 'height')
                this.slideYBackTop = -this.singlePicHeight.substring(0, this.singlePicHeight.length - 2)
                this.scrollYInitTop = -(this.ulDom.children.length - 1) * parseFloat(this.singlePicHeight) + 'px'
                this.setStyle(this.ulDom, {
                    position: 'absolute',
                    width: '100%',
                    top: this.scrollYInitTop
                })
                element.Timer = setInterval(() => {
                    let currentTop = parseFloat(this.getStyle(this.ulDom, 'top'))
                    let speed = parseFloat(this.singlePicHeight) / (autoplay.time / 25)
                    for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                        this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                    }
                    this.i = parseInt(-currentTop / (this.singlePicHeight.substring(0, this.singlePicHeight.length - 2)))
                    this.j = this.i
                    if (this.j > this.indicationPointUl.children.length - 1) {
                        this.j = 0
                    } else if (this.j < 0) {
                        this.j = this.indicationPointUl.children.length - 1
                    }
                    this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                    this.ulDom.style.top = currentTop + speed + 'px'
                    if (currentTop >= this.slideYBackTop) {
                        this.ulDom.style.top = this.scrollYInitTop
                    }
                }, 25)
                break

            case 'fade':
                this.setStyle(this.ulDom, {
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                })
                for (let i = 0; i < this.ulDom.children.length; i++) {
                    this.ulDom.children[i].style.cssText += 'position:absolute;left:0px;top:0px;'
                }
                this.i = 0
                element.Timer = setInterval(() => {
                    for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                        this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                    }
                    this.indicationPointUl.children[this.i].style.cssText += 'background-color:white'
                    for (let i = 0; i < this.ulDom.children.length; i++) {
                        this.ulDom.children[i].style.cssText += 'opacity:0'
                    }
                    this.attrAnimation(this.ulDom.children[this.i], 'opacity', 1, autoplay.time / 5, () => {
                        this.i++
                        if (this.i >= this.ulDom.children.length) {
                            this.i = 0
                        }
                    })
                }, autoplay.time)
                break
            default:
                alert("请核对effect?")
        }
    }
    /**绑定事件 */
    bindEvent(element, autoplay) {
        //鼠标进入轮播区域 停止自动轮播
        element.onmouseenter = () => {
            clearInterval(element.Timer)
            //左右或上下箭头事件
            if (autoplay.effect == 'slideX' || autoplay.effect == 'slideY' || autoplay.effect == 'fade') {
                //箭头显示
                this.arrowDoms.forEach(ele => {
                    this.setStyle(ele, {
                        display: 'block'
                    })
                    ele.onmouseover = () => {
                        ele.style.cssText += 'color:white'
                    }
                    ele.onmouseout = () => {
                        ele.style.cssText += 'color:#666'
                    }
                })
            }
            //左箭头 或上箭头 事件
            this.prev.onclick = () => {
                switch (autoplay.effect) {
                    case 'slideX':
                        //case 'scrollX':
                        this.i--
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.j = this.i - 1
                        if (this.j < 0) {
                            this.j = this.indicationPointUl.children.length - 1
                        } else if (this.j > this.indicationPointUl.children.length - 1) {
                            this.j = 0
                        }
                        this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                        this.slideLeftPrevClick = -(this.ulDom.children.length - 2) * parseFloat(this.singlePicWidth) + 'px'
                        this.slideXLTFT = -this.i * parseFloat(this.singlePicWidth)
                        this.attrAnimation(this.ulDom, 'left', this.slideXLTFT, autoplay.time / 10, () => {
                            if (this.i < 1) {
                                this.i = this.ulDom.children.length - 2
                                this.ulDom.style.left = this.slideLeftPrevClick
                            }
                        })
                        break
                    case 'slideY':
                        // case 'scrollY:
                        this.i++
                        this.slideTopPrevClick = -this.singlePicHeight.substring(0, this.singlePicHeight.length - 2) + 'px'
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.j = this.i - 1
                        if (this.j > this.indicationPointUl.children.length - 1) {
                            this.j = 0
                        } else if (this.j < 0) {
                            this.j = this.indicationPointUl.children.length - 1
                        }
                        this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                        this.slideYTOP = -this.i * parseFloat(this.singlePicHeight)
                        this.attrAnimation(this.ulDom, 'top', this.slideYTOP, autoplay.time / 10, () => {
                            if (this.i > this.ulDom.children.length - 2) {
                                this.i = 1
                                this.ulDom.style.top = this.slideYtop
                            }
                        })
                        break
                    case 'fade':
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.indicationPointUl.children[this.i].style.cssText += 'background-color:white'
                        for (let i = 0; i < this.ulDom.children.length; i++) {
                            this.ulDom.children[i].style.cssText += 'opacity:0'
                        }
                        this.attrAnimation(this.ulDom.children[this.i], 'opacity', 1, autoplay.time / 10, () => {
                            this.i--
                            if (this.i < 0) {
                                this.i = this.ulDom.children.length - 1
                            }
                        })
                        break
                }
            }
            //右箭头 或下箭头事件
            this.next.onclick = () => {
                switch (autoplay.effect) {
                    case 'slideX':
                        //case 'scrollX':
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.j = this.i
                        if (this.j > this.indicationPointUl.children.length - 1) {
                            this.j = 0
                        } else if (this.j < 0) {
                            this.j = this.indicationPointUl.children.length - 1
                        }
                        this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                        this.i++
                        this.slideXLTFT = -this.i * parseFloat(this.singlePicWidth)
                        this.attrAnimation(this.ulDom, 'left', this.slideXLTFT, autoplay.time / 10, () => {
                            if (this.i > this.ulDom.children.length - 2) {
                                this.i = 1
                                this.ulDom.style.left = this.slideLeft
                            }
                        })
                        break
                    case 'slideY':
                        // case 'scrollY:
                        this.i--
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.j = this.i - 1
                        if (this.j < 0) {
                            this.j = this.indicationPointUl.children.length - 1
                        } else if (this.j > this.indicationPointUl.children.length - 1) {
                            this.j = 0
                        }
                        this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                        this.slideYTOP = -this.i * parseFloat(this.singlePicHeight)
                        this.attrAnimation(this.ulDom, 'top', this.slideYTOP, autoplay.time / 10, () => {
                            if (this.i < 1) {
                                this.i = this.ulDom.children.length - 1
                                this.ulDom.style.top = this.slideTopDown
                            }
                        })
                        break
                    case 'fade':
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.indicationPointUl.children[this.i].style.cssText += 'background-color:white'
                        for (let i = 0; i < this.ulDom.children.length; i++) {
                            this.ulDom.children[i].style.cssText += 'opacity:0'
                        }
                        this.attrAnimation(this.ulDom.children[this.i], 'opacity', 1, autoplay.time / 10, () => {
                            this.i++
                            if (this.i > this.ulDom.children.length - 1) {
                                this.i = 0
                            }
                        })
                        break
                }
            }
            // 指示点 事件
            this.indicationPointUl.onmouseenter = () => {
                for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                    this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                }
                this.indicationPointDoms.forEach(ele => {
                    ele.onmouseenter = () => {
                        ele.style.cssText += 'background-color:white'
                    }
                    ele.onmouseleave = () => {
                        ele.style.cssText += 'background-color:#666'
                    }
                    //指示点点击事件 跳转对应图片
                    ele.onclick = () => {
                        //e = e || event
                        this.i = ele.value + 1
                        switch (autoplay.effect) {
                            case 'slideX':
                            case 'scrollX':
                                this.indicationPointLeft = -this.i * parseFloat(this.singlePicWidth)
                                this.attrAnimation(this.ulDom, 'left', this.indicationPointLeft, autoplay.time / 10)
                                break
                            case 'slideY':
                            case 'scrollY':
                                this.i = ele.value + 1
                                this.indicationPointTop = -this.i * parseFloat(this.singlePicHeight)
                                this.attrAnimation(this.ulDom, 'top', this.indicationPointTop, autoplay.time / 10)
                                break
                            case 'fade':
                                this.i = ele.value
                                for (let i = 0; i < this.ulDom.children.length; i++) {
                                    this.ulDom.children[i].style.cssText += 'opacity:0'
                                }
                                this.attrAnimation(this.ulDom.children[this.i], 'opacity', 1, autoplay.time / 5)
                                break
                        }
                    }
                })
            }
        }
        /**鼠标离开轮播区域 事件 */
        element.onmouseleave = () => {
            //左右或上下箭头隐藏
            this.arrowDoms.forEach(ele => {
                this.setStyle(ele, {
                    display: 'none'
                })
            })
            //重新开始自动轮播
            switch (autoplay.effect) {
                case 'slideX':
                    element.Timer = setInterval(() => {
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.j = this.i
                        if (this.j > this.indicationPointUl.children.length - 1) {
                            this.j = 0
                        } else if (this.j < 0) {
                            this.j = this.indicationPointUl.children.length - 1
                        }
                        this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                        this.i++
                        this.slideXLTFT = -this.i * parseFloat(this.singlePicWidth)
                        this.attrAnimation(this.ulDom, 'left', this.slideXLTFT, autoplay.time / 5, () => {
                            if (this.i > this.ulDom.children.length - 2) {
                                this.i = 1
                                this.ulDom.style.left = this.slideLeft
                            }
                        })
                    }, autoplay.time)
                    break
                case 'slideY':
                    element.Timer = setInterval(() => {
                        this.i--
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.j = this.i - 1
                        if (this.j < 0) {
                            this.j = this.indicationPointUl.children.length - 1
                        } else if (this.j > this.indicationPointUl.children.length - 1) {
                            this.j = 0
                        }
                        this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                        this.slideYTOP = -this.i * parseFloat(this.singlePicHeight)
                        this.attrAnimation(this.ulDom, 'top', this.slideYTOP, autoplay.time / 5, () => {
                            if (this.i < 1) {
                                this.i = this.ulDom.children.length - 1
                                this.ulDom.style.top = this.slideTopDown
                            }
                        })
                    }, autoplay.time)
                    break
                case 'scrollX':
                    element.Timer = setInterval(() => {
                        let currentLeft = parseFloat(this.getStyle(this.ulDom, 'left'))
                        let speed = -parseFloat(this.singlePicWidth) / (autoplay.time / 25)
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.i = parseInt(-currentLeft / (this.singlePicWidth.substring(0, this.singlePicWidth.length - 2)))
                        this.j = this.i - 1
                        if (this.j > this.indicationPointUl.children.length - 1) {
                            this.j = 0
                        } else if (this.j < 0) {
                            this.j = this.indicationPointUl.children.length - 1
                        }
                        this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                        this.ulDom.style.left = currentLeft + speed + "px"
                        if (currentLeft <= this.scrollXLEFT) {
                            this.ulDom.style.left = this.scrollXInitXLeft
                        }
                    }, 25)
                    break
                case 'scrollY':
                    element.Timer = setInterval(() => {
                        let currentTop = parseFloat(this.getStyle(this.ulDom, 'top'))
                        let speed = parseFloat(this.singlePicHeight) / (autoplay.time / 25)
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.i = parseInt(-currentTop / (this.singlePicHeight.substring(0, this.singlePicHeight.length - 2)))
                        this.j = this.i
                        if (this.j > this.indicationPointUl.children.length - 1) {
                            this.j = 0
                        } else if (this.j < 0) {
                            this.j = this.indicationPointUl.children.length - 1
                        }
                        this.indicationPointUl.children[this.j].style.cssText += 'background-color:white'
                        this.ulDom.style.top = currentTop + speed + 'px'
                        if (currentTop >= this.slideYBackTop) {
                            this.ulDom.style.top = this.scrollYInitTop
                        }
                    }, 25)
                    break
                case 'fade':
                    element.Timer = setInterval(() => {
                        for (let i = 0; i < this.indicationPointUl.children.length; i++) {
                            this.indicationPointUl.children[i].style.cssText += 'background-color:#666'
                        }
                        this.indicationPointUl.children[this.i].style.cssText += 'background-color:white'
                        for (let i = 0; i < this.ulDom.children.length; i++) {
                            this.ulDom.children[i].style.cssText += 'opacity:0'
                        }
                        this.attrAnimation(this.ulDom.children[this.i], 'opacity', 1, autoplay.time / 5, () => {
                            this.i++
                            if (this.i >= this.ulDom.children.length) {
                                this.i = 0
                            }
                        })
                    }, autoplay.time)
                    break
            }
        }
    }

    /**计算元素样式工具函数 */
    getStyle(element, attr) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(element, false)[attr];
        } else {
            return element.currentStyle[attr];
        }
    }
    /**设置元素样式函数 */
    setStyle(element, options) {
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                //element.style[i] = options[i]
                element.style.setProperty(i, options[i])
            }
        }
    }
    /** 元素属性变化动画函数*/
    attrAnimation(element, attr, target, time, callback) {
        let interval = 20
        let speed = 0
        let current = parseFloat(this.getStyle(element, attr))
        if (target != current) {
            speed = (target - current) / (time / interval)
        } else {
            return
        }
        clearInterval(element.timer);
        element.timer = setInterval(() => {
            current = parseFloat(this.getStyle(element, attr))
            attr === "opacity" ? element.style[attr] = current + speed : element.style[attr] = current + speed + "px"
            if (speed > 0) {
                if (current >= target) {
                    clearInterval(element.timer);
                    attr === "opacity" ? element.style[attr] = target : element.style[attr] = target + "px"
                    callback && callback();
                }
            } else {
                if (current <= target) {
                    clearInterval(element.timer);
                    attr === "opacity" ? element.style[attr] = target : element.style[attr] = target + "px"
                    callback && callback();
                }
            }
        }, interval);
    }
    /**自动轮播 */
    autoplay() {
    }
}

