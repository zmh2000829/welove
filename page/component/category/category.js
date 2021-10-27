Page({
    data: {
        presentee: {},
        imgList: [],
        imgMaxNumber: 1,
        name: "",
        admin: "user",
        uid: ''
    },
    onLoad(){
        var self = this;
        wx.getStorage({
            key: 'info',
            success: function(res){
                self.setData({
                    name : res.data['username'],
                    admin : res.data['admin'] === 1 ? '管理员' : '普通用户',
                    uid: res.data['uid']
                })
            }
        })
    },
    nameInput: function(e){
        this.data.presentee['username'] = e.detail.value;
    },
    ageInput: function(e){
        this.data.presentee['age'] = e.detail.value;
    },
    heightInput: function(e){
        this.data.presentee['height'] = e.detail.value;
    },
    schoolInput: function(e){
        this.data.presentee['school'] = e.detail.value;
    },
    majorInput: function(e){
        this.data.presentee['major'] = e.detail.value;
    },
    radiochange: function(e){
        this.data.presentee['gender'] = Number(e.detail.value)
    },
    bindTextAreaBlur: function(e){
        this.data.presentee['details'] = e.detail.value
    },
    ChooseImage() {
        wx.chooseImage({
          count: this.data.imgMaxNumber, 
          sizeType: 'compressed', //压缩图
          sourceType: ['album'], //从相册选择
          success: (res) => {
            if (this.data.imgList.length != 0) {
              this.setData({
                imgList: this.data.imgList.concat(res.tempFilePaths)
              })
            } else {
              this.setData({
                imgList: res.tempFilePaths
              })
            }
          }
        });
    },
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    DelImg(e) {
        wx.showModal({
            title: '确定删除这张图片吗？',
            cancelText: '再看看',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })
    },
    uploadImgs(pInfo) {
        console.log(this.data.imgList)
        var that = this;
        wx.uploadFile({
            url: 'https://wx.link-studio.cn:8889/upload',
            filePath: this.data.imgList[0],
            name: 'file',
            success (res){
                console.log(res.data)
                pInfo['pic'] = res.data
                that.uploadInfo(pInfo)
            },
            fail (res){
                console.log(res)
                wx.showToast({
                    title: '上传图片错误',
                    icon: 'error'
                })
            }
        })
    },
    submit: function(){
        console.log(this.data.presentee)
        var pInfo = this.data.presentee
        var that = this;
        if(pInfo['gender'] === undefined && (pInfo['username'] == undefined || pInfo['username'] == '') && (pInfo['age'] == undefined || pInfo['age'] == '') && (pInfo['school'] == undefined || pInfo['school'] == '')){
            wx.showModal({
                title:'提示',
                content:'请填写必填信息',
                showCancel:false
            })
        }else{
            wx.showModal({
                title:'提示',
                content:'确定提交该推荐吗',
                success(res){
                    if(res.cancel){
                        console.log(123)
                    }else if(res.confirm){
                        console.log(1234)
                        if(that.data.imgList.length === 0){
                            that.uploadInfo(pInfo)
                        }else{
                          that.uploadImgs(pInfo);  
                        }
                    }
                }
            })
        }
    },
    uploadInfo(info){
        var param = info;
        param['referer'] = this.data.uid
        if(param['height'] === undefined){
            param['height'] = ''
        }
        if(param['major'] === undefined){
            param['major'] = ''
        }
        if(param['details'] === undefined){
            param['details'] = ''
        }
        if(param['pic'] == undefined){
            param['pic'] = 'https:link-studio.cn/welove/images/head.jpg'
        }
        wx.request({
            url: 'https://wx.link-studio.cn:8889/upload_presentee',
            method: "POST",
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'chartset': 'utf-8'
            },
            data:{
                pinfo: JSON.stringify(param)
            },
            success: function(res) {
                console.log(res)
                wx.showToast({
                    title: '上传成功，等待审核',
                    icon: 'success'
                })
                if (getCurrentPages().length != 0) {
                   getCurrentPages()[getCurrentPages().length - 1].onLoad()
                }
            },
            fail (res){
                console.log(res)
                wx.showToast({
                    title: '上传失败，稍后再试',
                    icon: 'error'
                })
            }
        })
    },
    switchTab(e){
      const self = this;
      this.setData({
        isScroll: true
      })
      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      setTimeout(function () {
        self.setData({
          isScroll: false
        })
      },1)
        
    }
    
})