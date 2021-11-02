// page/component/new-pages/user/address/address.js
var app = getApp();

Page({
  data:{
    info:{
      username:'',
      gender: -1,
      contact: ''
    },
  },
  onLoad(){
    var self = this;
    wx.getStorage({
      key: 'info',
      success: function(res){
        self.setData({
          info : res.data
        })
      }
    })
  },
  updateStorageInfo(param){
    var key = param.key
    var newData = param.newData

    var tempData = {}

    wx.getStorage({
      key: key,
      success(res) {
        var storage = res.data
        for (var prop in storage) {
          for (var pr in newData) {
            if (prop == pr) {
              storage[prop] = newData[pr]
            }
          }
        }
        tempData = storage
        wx.setStorage({
          key: key,
          data: tempData,
          success(res) {
            param.success(res)
          },
          fail(res) {
            param.fail(res)
          }
        })
      },
      fail(res) {
        param.fail(res)
      },
      complete(res) {
        param.complete(res)
      }
    })
  },
  radiochange:function(e){
    this.data.info['gender'] = Number(e.detail.value)
  },
  updateData:function(udata){
    console.log(udata)
    wx.request({
      // url: 'http://localhost:5001/updateInfo',
      url: 'https://wx.link-studio.cn:8889/updateInfo',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data:{
        info: udata
      },
      success: function(res) {
        console.log(res)
        wx.reLaunch({
          url: '../user/user'
        })
      }
    })
  },
  formSubmit(e){
    const value = e.detail.value;
    value['gender'] = this.data.info['gender']
    console.log(value)
    if (value.username && value.gender !== -1 && value.contact){
      var that = this;
      this.updateStorageInfo({
        key: 'info',
        newData: value,
        success(res){
          console.log(res)
        },
        fail(res) {
          console.log(res)
        },
        complete(res) {
          console.log(res)
          that.updateData(JSON.stringify(res.data))
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  }
})