import Config from '../../etc/config'
var util = require('../../utils/util.js');

const App = getApp()

Page({
  data: {
    showTopTips: false,
    content: "",
    phone: "",
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
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  bindContentChange: function (e) {
    this.setData({
      content: e.detail.value
    });
  },
  bindPublish: function (e) {
    if (this.data.phone === undefined || this.data.phone === "") {
      this.setData({
        errorMessage: "手机号不能为空！"
      });
      this.showTopTips()
      return
    } else if (!util.isMobilePhone(this.data.phone)){
      this.setData({
        errorMessage: "请检查并输入正确的手机号！"
      });
      this.showTopTips()
      return
    }

    if (this.data.content === undefined || this.data.content === "") {
      this.setData({
        errorMessage: "消息不能为空！"
      });
      this.showTopTips()
      return
    }


    var self = this;
    wx.showToast({
      title: '预约发布中...',
      icon: 'loading',
      duration: 5000
    });

    this.events.saveAsync({
      "type": 'appointment',
      "avatar_url": this.userInfo.avatarUrl,
      "loginname": this.userInfo.nickName + '@' + this.userInfo.city,
      "title": '系统消息：您的预约己收到，刘教练会随后联系您，请保持电话畅通。',
      "content": this.data.content,
      "phone": this.data.phone
    }).then(res => {
      console.log(res)
      if (res.success) {
        var data = res.data
        data.last_reply_at = util.setTimeReadable(data.last_reply_at)
        
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 3000
        });

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        console.log(prevPage)
        prevPage.data.postsList.unshift(data)

        prevPage.setData({
          postsList: prevPage.data.postsList
        })

        wx.navigateBack({
          delta: 1
        })
      }
    })

  }
});