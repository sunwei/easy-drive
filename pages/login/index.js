const App = getApp()

Page({
    data: {
        logged: !1
    },
    onLoad() {
    },
    onShow() {
        const token = App.WxService.getStorageSync('token')
        this.setData({
            logged: !!token
        })
        token && setTimeout(this.goIndex, 1500)
    },
    login() {
        this.signIn(this.goIndex)
    },
    goIndex() {
      App.WxService.redirectTo('/pages/index/index')
    },
    showModal() {
        App.WxService.showModal({
            title: '友情提示',
            content: '获取用户登录状态失败，请重新登录',
            showCancel: !1,
        })
    },
    signIn(cb) {
        if (App.WxService.getStorageSync('token')) return
        wx.login({
            success: function (res) {
                let code = res.code
                wx.getUserInfo({
                    withCredentials: true,
                    success: function (res) {
                      console.log(res.userInfo)
                      App.WxService.setStorageSync('token', res.userInfo.nickName)
                      App.WxService.setStorageSync('userinfo', res.userInfo)
                      cb()
                    },
                    fail: function(res){
                        console.log(res)
                    }
                })
            }
        })
    },
})
