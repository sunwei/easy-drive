import Config from '../../etc/config'
var util = require('../../utils/util.js');

const App = getApp()

Page({
    data: {
      coachInfo: { nickName: '刘教练', description: '13年教学经验，不止于用心！', "phone": "15927115522"},
      like: 0,
      message: 0,
      postsList: [],
      hidden: false,
      page: 1,
      sourceJson: null,
      postPerPage: 5
    },
    onLoad() {
      this.lastLikeDate = null
      this.userInfo = App.WxService.getStorageSync('userinfo')
      this.posts = App.HttpResource('/easy-drive/:id', {id: '@id'})
      this.events = App.HttpResource('/events/:id', { id: '@id' })
      this.fetchData()
    },
    onShow() {
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.setData({
            postsList: [],
            page: 1
        })
        this.fetchData()
    },
    onReachBottom() {
      this.fetchData()
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
      return util.getDateDiff(new Date(timeStr))
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

      this.events.saveAsync({
        "type": 'like',
        "avatar_url": this.userInfo.avatarUrl,
        "loginname": this.userInfo.nickName + '@' + this.userInfo.city,
        "title": '给刘教练点了个赞！加油！'
      }).then(res => {
        console.log(res)
        if(res.success){
          var data = res.data
          data.last_reply_at = this.setTimeReadable(data.last_reply_at)
          self.data.postsList.unshift(data)
          self.setData({
            like: (self.data.like + 1),
            postsList: self.data.postsList
          })

          self.lastLikeDate = new Date();
          console.log(self.lastLikeDate)
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 3000
          });
        }
      })
    },
    onCallButtonClicked() {
      var self = this

      App.WxService.makePhoneCall({
        phoneNumber: this.data.coachInfo.phone,
        complete: function(res){
          if (res.errMsg === 'makePhoneCall:ok') {
            self.events.saveAsync({
              "type": 'call',
              "avatar_url": self.userInfo.avatarUrl,
              "loginname": self.userInfo.nickName + '@' + self.userInfo.city,
              "title": '向刘教练打了个电话，咨询了一些问题。'
            }).then(res => {
              console.log(res)
              if (res.success) {
                var data = res.data
                data.last_reply_at = self.setTimeReadable(data.last_reply_at)
                self.data.postsList.unshift(data)
                self.setData({
                  postsList: self.data.postsList
                })
              }
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
      self.setData({
          hidden: false
      });

      if (this.data.page === 1) {
        self.setData({
            postsList: []
        });

        this.posts.queryAsync({}).then(res => {
          console.log(res)
          let firstPagePosts = res.data.events.slice(0, this.data.postPerPage)
          self.setData({
            postsList: self.data.postsList.concat(firstPagePosts.map(function (item) {
              item.last_reply_at = util.getDateDiff(new Date(item.last_reply_at));
              return item;
            })),
            coachInfo: res.data.coachInfo,
            page: (self.data.page + 1),
            sourceJson: res.data
          })
          self.analyseData(res.data.events)
        })
      } else {
        let totalPageNumber = this.data.sourceJson.events % this.data.postPerPage
        if(totalPageNumber <= this.data.page){
          return;
        }
        console.log(this.data.page)
        let lastIndex = (this.data.page - 1) * this.data.postPerPage;
        let thePagePosts = this.data.sourceJson.events.slice(lastIndex, lastIndex + this.data.postPerPage)
        this.setData({
          postsList: self.data.postsList.concat(thePagePosts.map(function (item) {
            item.last_reply_at = util.getDateDiff(new Date(item.last_reply_at));
            return item;
          })),
          page: (self.data.page + 1)
        })
      }
    },
    showWarning() {
        App.WxService.showModal({
            title: '温馨提示',
            content: '请进入房源详情页面，由业主邀请认证后，才可以查看相关房源的保密信息！',
            confirmText: "确认",
            showCancel: false,
            success: function (res) {
                // res.confirm
            }
        })
    },
    onShareAppMessage: function () {
        return {
          title: '首页 - 刘教学车',
          path: '/pages/index/index',
          success: function(res) {
          },
          fail: function(res) {
          }
        }
    }
})
