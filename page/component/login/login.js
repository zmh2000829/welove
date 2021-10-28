const app = getApp();

Page({
  data:{
    token: '',
    remind: '加载中',
    angle: 0,
    loading: false,
    login: true,
    name: '',
    nickname: '',
    gender: 0,
    passwd: '',
    password: ''
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {}
    return {
      path: 'pages/component/login/login'
    }
  },
  onLoad: function() {

  },
  onShow: function() {

  },
  onReady: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        remind: ''
      });
    }, 1000);
    // wx.onAccelerometerChange(function(res) {
    //   var angle = -(res.x * 30).toFixed(1);
    //   if (angle > 14) {
    //     angle = 14;
    //   } else if (angle < -14) {
    //     angle = -14;
    //   }
    //   if (that.data.angle !== angle) {
    //     that.setData({
    //       angle: angle
    //     });
    //   }
    // });
  },
  toRegister: function(){
    this.setData({
      login: false
    })
  },
  toLogin: function(){
    this.setData({
      login: true
    })
  },
  radioChange: function(e) {
    this.data.gender = e.detail.value
  },
  listenernicknameInput: function(e) {
    this.data.nickname = e.detail.value;
  },
  listenerpasswdInput: function(e) {
    this.data.passwd = e.detail.value;
  },
  listenerpasswordInput: function(e) {
    this.data.password = e.detail.value;
  },
  listenernameInput: function(e) {
    this.data.name = e.detail.value;
  },
  listenercontactInput: function(e) {
    this.data.contact = e.detail.value;
  },
  doRegister: function(){
    var that = this;
    this.setData({
      loading: true
    });
    wx.request({
      url: 'https://wx.link-studio.cn:8889/register',
      // url: 'http://localhost:5001/register',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data:{
        nickname: JSON.stringify(this.data.nickname),
        passwd: JSON.stringify(this.data.passwd),
        gender: JSON.stringify(this.data.gender),
        contact: JSON.stringify(this.data.contact)
      },
      success: function(res) {
        that.setData({
          loading: false
        });
        wx.showToast({
          title: '注册成功',
          icon: 'none',
          duration: 2000
        });
        wx.redirectTo({
          url: '../login/login'
        })
      },
      fail: function(res) {
        that.setData({
          loading: false
        });
        wx.showToast({
          title: '注册失败',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  tosecondPage: function(e){
    this.setData({
      loading: true
    });
    var that = this;
    wx.request({
      // url: 'http://localhost:5001/login',
      url: 'https://wx.link-studio.cn:8889/login',
      method: "POST",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      data:{
        nickname: JSON.stringify(this.data.name),
        passwd: JSON.stringify(this.data.password)
      },
      success: function(res) {
        that.setData({
          loading: false
        });
        var mes = res.data;
        console.log(mes);
        if(mes['uid'] !== undefined){
          app.globalData.uid = mes['uid'];
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000
          });
          wx.setStorage({
            key: 'info',
            data: mes,
            success(){
              console.log('success')
            }
          })
          wx.switchTab({
            url: '../card/card'
          })
        }else{
          that.setData({
            loading: false
          });
          wx.showToast({
            title: '昵称或密码错误',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function(res) {
        that.setData({
          loading: false
        });
        console.log(res)
        wx.showToast({
          title: '登陆失败',
          icon: 'none',
          duration: 2000
        });
      }
    })
  }
})