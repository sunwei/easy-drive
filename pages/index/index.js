import Config from '../../etc/config'
var util = require('../../utils/util.js');

const App = getApp()

Page({
    data: {
      coachInfo: { nickName: '刘教练', description: '13年教学经验，不止于用心！', "phone": "15927115522"},
      like: 0,
      message: 0,
      postsList: [],
    },
    onLoad() {
      this.lastLikeDate = null
      this.userInfo = App.WxService.getStorageSync('userinfo')
      this.fetchData()
    },
    onShow() {
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.fetchData()
    },
    onReachBottom() {
      console.info('onReachBottom')
    },
    syncData() {
      var self = this
      let postList = App.globalData.events
      self.setData({
        postsList: postList.map(function (item) {
          item.last_reply_at = self.setTimeReadable(item.last_reply_at);
          if (item.author.loginname === 'undefined@undefined'
            || item.author.loginname === '　@') {
            item.author.loginname = '匿名用户'
          }
          if (item.author.avatar_url === ''
            || item.author.avatar_url === undefined) {
            item.author.avatar_url = '../../assets/images/2107_logo_64*64.png'
          }
          return item;
        }),
        coachInfo: App.globalData.coachInfo
      })
      self.analyseData(postList)
    },
    analyseData(events) {
      var likeCount = 0
      var messageCount = 0
      events.forEach(function(item){
        if('like' === item.type){ 
          likeCount++
        } else if ('message' === item.type){
          messageCount++
        }
      })
      this.setData({
        like: likeCount,
        message: messageCount
      })
    },
    setTimeReadable(timeStr){      
      return util.getDateDiff(util.newDateFromString(timeStr))
    },
    isLastLike4HoursAgo(){
      if(!this.lastLikeDate){return true}
      console.log(util.getDateDistanceOfHours(this.lastLikeDate))
      if (util.getDateDistanceOfHours(this.lastLikeDate) > 4){
        return true
      }
      return false
    },
    onLikeButtonClicked() {
      if (this.lastLikeDate && !this.isLastLike4HoursAgo()){
        App.WxService.showModal({
          content: '你的热情刘教练已经感受到了！但不要这么急切，距离上一次感谢需要4个小时来消化，让刘教练先缓一缓！',
          confirmText: "确认",
          showCancel: false,
          success: function (res) {
            // res.confirm
          }
        })
        return
      }

      var self = this
      wx.showToast({
        title: '点个赞...',
        icon: 'loading',
        duration: 5000
      });

      App.updateJsonFile({
        "type": 'like',
        "avatar_url": this.userInfo.avatarUrl,
        "loginname": this.userInfo.nickName + '@' + this.userInfo.city,
        "title": '给刘教练点了个赞！加油！'
      }, function(){
        self.syncData()
        self.lastLikeDate = new Date();
        console.log(self.lastLikeDate)
        wx.showToast({
          title: '点赞成功',
          icon: 'success',
          duration: 3000
        });
      })
    },
    onCallButtonClicked() {
      var self = this

      App.WxService.makePhoneCall({
        phoneNumber: this.data.coachInfo.phone,
        complete: function(res){
          if (res.errMsg === 'makePhoneCall:ok') {

            App.updateJsonFile({
              "type": 'call',
              "avatar_url": self.userInfo.avatarUrl,
              "loginname": self.userInfo.nickName + '@' + self.userInfo.city,
              "title": '向刘教练打了个电话，咨询了一些问题。'
            }, function () {
              self.syncData()
            })

          }
        }
      })
    },
    onClicked(e) {
      let action = e.currentTarget.dataset.id;
      switch(action){
        case 'like':
          this.onLikeButtonClicked()
          break
        case 'message':
          App.WxService.navigateTo('/pages/comment/index')
          break
        case 'call':
          this.onCallButtonClicked()
          break
        case 'appointment':
          App.WxService.navigateTo('/pages/appointment/index')
          break
      }
    },
    fetchData: function () {
      var self = this;
      this.setData({
        postsList:[]
      })

      App.refreshJsonData(function(){
        self.syncData()
        wx.stopPullDownRefresh()
      })
    },
    onShareAppMessage: function () {
      var self = this
        return {
          title: '首页 - 刘教学车',
          path: '/pages/index/index',
          complete: function (res) {
            if (res.errMsg === 'shareAppMessage:ok') {

              App.updateJsonFile({
                "type": 'share',
                "avatar_url": self.userInfo.avatarUrl,
                "loginname": self.userInfo.nickName + '@' + self.userInfo.city,
                "title": '谢谢你的分享！Easy life, easy drive!'
              }, function () {
                self.syncData()
              })

            }
          },
          fail: function(res) {
          }
        }
    }
})
