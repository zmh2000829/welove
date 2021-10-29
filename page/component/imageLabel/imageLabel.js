// pages/imageLabel/imageLabel.js
import util from '../../../utils/util.js'

Component({
  data: {
    tagList: [],
    list: [],
    isWarning: false,
    isShowInput: false,
    customTag: '',
    imageLabel_tit2: '最多添加4个标签，已添加4个',
    colorArr: [],
    randomColorArr: []
  },
  lifetimes: {
    attached: function () {
    // 生成随机颜色
      let colorArr = []
      let tagList = []
      let temp = ['运动达人','大佬','养生朋克','憨憨','宅','有点特别','快乐源泉','佛系躺平','熬夜冠军','工作狂','甜','吃货','影迷','麦霸','勤俭持家']
      
      for (let i = 0; i < temp.length + 1; i++) {
        colorArr.push(util.color())
      }
      console.log('随机颜色数组', colorArr)
      temp.forEach((item, index) => {
        tagList.push({
          id: index + 1,
          title: item,
          checked: false
        })
      })
      this.setData({
        tagList,
        colorArr
      })
    },
    detached: function() {}
  },

  methods: {
    // 获取value值
    inputVal(e) {
      this.setData({
        customTag: e.detail.value
      })
    },
    // 点击添加
    tagTap: function (e) {
      let [tagList, tagIndex, list] = [
        this.data.tagList,
        e.currentTarget.dataset.index,
        this.data.list
      ]
      // 判断长度
      if (list.length > 3) {
        this.setData({
          isWarning: true
        })
        return
      }
      for (let i = 0; i < tagList.length; i++) {
        if (i === tagIndex) {
          if (tagList[i].checked === false) {
            tagList[i].checked = true
            list.push(tagList[i])
          }
        }
      }
      this.setData({
        tagList: tagList,
        list: list
      })
    },
    // 点击移除
    removeTagTap(e) {
      let [tagList, id, list] = [
        this.data.tagList,
        e.currentTarget.dataset.id,
        this.data.list
      ]
      if (list.length < 5) {
        this.setData({
          isWarning: false
        })
      }
      for (let j = 0, jLen = list.length; j < jLen; j++) {
        if (id == list[j].id) {
          list.splice(j, 1)
          break
        }
      }
      for (let i = 0; i < tagList.length + 1; i++) {
        if (id == tagList[i].id) {
          tagList[i].checked = false
          break
        }
      }
      this.setData({
        tagList: tagList,
        list: list
      })
    },

    // 自定义标签
    saveTab() {
      let [that, tagList, customTag, lastId] = [
        this,
        this.data.tagList,
        this.data.customTag,
        this.data.tagList.length
      ]
      if (customTag !== '') {
        tagList.unshift({
          title: customTag,
          id: lastId,
          checked: false
        })
        that.setData({
          tagList,
          isShowInput: false
        })
      }
    },
    // 点击转换为input输入
    clickAddImageLabel() {
      let isShowInput = this.data.isShowInput
      let that = this
      this.setData({
        isShowInput: !isShowInput
      })
    },

    sub() {
      console.log(this.data.list);
      var res = JSON.stringify(this.data.list);
      this.triggerEvent('childFun', { tagShow: false, tagList: res});
    }

  }  
})