App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    uid: '',
    hasLogin: false,
    username: '',
    gender: '',
    score: 0,
    admin: 1,
    token: ''
  }
})
