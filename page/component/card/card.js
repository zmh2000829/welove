// pages/card/card.js
const app = getApp();

var touch = [0, 0];
Page({
  data: {
    cardData: [],
    testCurrentNav: 0,
    currentIndex: 0,
    currentCard: {},
    cardDistance: 0,
    classArray: ['active', 'next'],
    loading: true
  },
  onLoad: function (options) {
    this.getRecommends();
  },
  onPullDownRefresh: function () {
    wx.reLaunch({
      url: '../card/card'
    })
  },
  onTouchStart(e) {
    console.log(e)
    touch[0] = e.touches[0].clientX
  },
  onTouchEnd(e) {
    touch[1] = e.changedTouches[0].clientX;
    if (touch[0] - touch[1] > 5) {
      this.addClassName('left');
    } else if (touch[1] - touch[0] > 5) {
      this.addClassName('right');
    }
  },
  getRecommends(){
    var that = this;
    wx.request({
      url: 'https://wx.link-studio.cn:8889/getrecommends',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data:{
        flag: 2,
        uid: app.globalData.uid
      },
      success: function(res) {
        console.log(res)
        if(res.data['data'].length > 0){
          that.setData({
            cardData: res.data['data'],
            currentCard: res.data['data'][0]
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: '目前还未有人被推荐呢~',
          })
        }
        that.setData({
          loading: false
        });
      },
      fail: res => { 
        console.log('加载失败', res);
        that.setData({
          loading: false
        });
      }
    })
  },
  getReferer: function(event){
    var that = this;
    var refer = event.currentTarget.dataset.referer;
    wx.request({
      url: 'https://wx.link-studio.cn:8889/get_referer',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data:{
        referer: refer
      },
      success: function(res) {
        console.log(res)
        wx.showModal({
          title:'推荐人:' + res.data.data[0],
          content:'联系方式:' + res.data.data[1],
          showCancel:false
        })
      }
    })
  },
  addClassName(direction) {
    let currentIndex = this.data.currentIndex
    let currentCard = {}
    let cardData = this.data.cardData
    let length = cardData.length
    let classArray = new Array(length)

    if (direction === 'left') {  // 向左滑动
      if (++currentIndex >= length) return

      classArray[currentIndex] = 'active';
      classArray[currentIndex - 1] = 'prev';
      if (currentIndex + 1 < length) {
        classArray[currentIndex + 1] = 'next';
      }

    } else if (direction === 'right') {  // 向右滑动
      if (--currentIndex < 0) return

      if (currentIndex - 1 >= 0) {
        classArray[currentIndex - 1] = 'prev';
      }
      classArray[currentIndex] = 'active';
      classArray[currentIndex + 1] = 'next';

    }

    currentCard = cardData[currentIndex]
    this.moveCard(direction)

    this.setData({
      currentIndex,
      classArray,
      currentCard,
    })
  },
  // 创建平移动画
  moveCard(direction) {
    let currentIndex = this.data.currentIndex + 1
    let cardDistance = this.data.cardDistance

    if (direction === 'left') {
      cardDistance -= 549
    } else if (direction === 'right') {
      cardDistance += 549
    }

    this.setData({
      cardDistance
    })
  },
  // 实现页面跳转
  onTapNavigateTo(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id, e)
  },
})