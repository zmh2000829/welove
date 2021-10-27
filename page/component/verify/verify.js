const app = getApp();

Page({
  data: {
    recommends: [],
    isEmpty: 2
  },
  onShow() {

  },
  onLoad() {
    this.getRecommends()
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
        flag: 1,
        uid: app.globalData.uid
      },
      success: function(res) {
        console.log(res)
        if(res.data['data'].length > 0){
          that.setData({
            recommends: res.data['data'],
            isEmpty: 0
          })
        }else{
          that.setData({
            isEmpty: 1
          })
        }
      }
    })
  },
  submitAC: function(event) {
    var pid = event.currentTarget.dataset.pid;
    var uid = event.currentTarget.dataset.uid;
    var that = this
    wx.request({
      url: 'https://wx.link-studio.cn:8889/verify',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data:{
        flag: 0,
        pid: pid,
        uid: uid
      },
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: '操作成功',
          icon: 'success'
        })
        wx.switchTab({
          url: '../user/user'
        })
      }
    })
  },
  submitDY: function(event) {
    var pid = event.currentTarget.dataset.pid
    var uid = event.currentTarget.dataset.uid
    var that = this
    wx.request({
      url: 'https://wx.link-studio.cn:8889/verify',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data:{
        flag: 1,
        pid: pid,
        uid: uid
      },
      success: function(res) {
        wx.showToast({
          title: '操作成功',
          icon: 'success'
        })
        wx.switchTab({
          url: '../user/user'
        })
      }
    })
  }
})