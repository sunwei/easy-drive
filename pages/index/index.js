import Config from '../../etc/config'
var util = require('../../utils/util.js');

const App = getApp()

Page({
    data: {
      coachInfo: { nickName: '刘教练', description: '13年教学经验，不止于用心！', "phone": "15927115522"},
      like: 67,
      message: 88,
      postsList: [],
      hidden: false,
      page: 1,
      sourceJson: null,
      postPerPage: 5
    },
    onLoad() {
      this.posts = App.HttpResource('/easy-drive/:id', {id: '@id'})
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
    analyseData() {
      
    },
    onLikeButtonClicked() {},
    onCallButtonClicked() {
      App.WxService.makePhoneCall({
        phoneNumber: this.data.coachInfo.phone,
        complete: function(res){
          if (res.errMsg === 'makePhoneCall:ok') {
            
          }
        }
      })
    },
    onAppointmentButtonClicked() {
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
          this.onAppointmentButtonClicked()
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
          this.analyseData()
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
