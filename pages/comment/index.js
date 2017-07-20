import Config from '../../etc/config'
var util = require('../../utils/util.js');

const App = getApp()

Page({
  data: {
    showTopTips: false,
    content: "",
    errorMessage: "提示消息"
  },
  onLoad() {
    this.events = App.HttpResource('/events/:id', { id: '@id' })
    this.userInfo = App.WxService.getStorageSync('userinfo')
  },
  showTopTips: function(){
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function(){
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindContentChange: function (e) {
    this.setData({
      content: e.detail.value
    });
  },
  bindPublish: function (e) {
    if (this.data.content === undefined || this.data.content === "") {
      this.setData({
        errorMessage: "消息不能为空！"
      });
      this.showTopTips()
      return
    }

    var self = this;
    wx.showToast({
      title: '消息发布中',
      icon: 'loading',
      duration: 5000
    });

    this.events.saveAsync({
      "type": 'message',
      "avatar_url": this.userInfo.avatarUrl,
      "loginname": this.userInfo.nickName + '@' + this.userInfo.city,
      "title": this.data.content
    }).then(res => {
      console.log(res)
      if (res.success) {
        var data = res.data
        data.last_reply_at = util.setTimeReadable(data.last_reply_at)
        
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 3000
        });

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        console.log(prevPage)
        prevPage.data.postsList.unshift(data)

        prevPage.setData({
          message: (prevPage.data.message + 1),
          postsList: prevPage.data.postsList
        })

        wx.navigateBack({
          delta: 1
        })
      }
    })

  }
});