import polyfill from 'assets/plugins/polyfill'
import WxValidate from 'helpers/WxValidate'
import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'
import Utils from 'utils/util'

App({
  globalData: {
    userInfo: null,
    coachInfo: { nickName: '刘教练', description: '13年教学经验，不止于用心！', "phone": "15927115522" },
    events: []
  },
    onLaunch() {
        this.jsonResource = this.HttpResource('/:id', { id: '@id' })
    },
    onShow() {
      var self = this
      this.refreshJsonData(function(){
        console.log('refreshJsonData success...')
      })
    },
    onHide() { console.log('onHide')},
    refreshJsonData(cb) {
      var self = this
      this.jsonResource.queryAsync({}).then(res => {
        self.globalData.coachInfo = res.coachInfo
        self.globalData.events = res.events
        if (cb) {
          cb()
        }
      })
    },
    updateJsonFile(event, cb) {
      var self = this
      event.last_reply_at = Utils.formatDate(new Date())
      event.author = {
        'avatar_url': event.avatar_url,
        'loginname': event.loginname
      }
      event.content = event.content || ''
      event.phone = event.phone || ''
      console.log(event)

      this.refreshJsonData(function(){
        self.globalData.events.unshift(event)
        self.jsonResource.updateAsync(JSON.stringify({
          "coachInfo": self.globalData.coachInfo,
          "events": self.globalData.events
        })).then(res => {
          self.globalData.coachInfo = res.coachInfo
          self.globalData.events = res.events
          if (cb) {
            cb()
          }
        })
      })
    },
    renderImage(path) {
        if (!path) return ''
        if (path.indexOf('http') !== -1) return path
        return `${this.Config.fileBasePath}${path}`
    },
    WxValidate: (rules, messages) => new WxValidate(rules, messages),
    HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
    HttpService: new HttpService,
    WxService: new WxService,
    Tools: new Tools,
    Config: Config,
})