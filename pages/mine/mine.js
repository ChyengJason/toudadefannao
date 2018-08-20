const app = getApp()
const { getShareInfo, getAutoPage, setAutoPage, getLastNextBtn, setLastNextBtn } = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAutoPage: true,
    isLastNextBtn: true
  },
  
  bindViewTap: function () {
    app.aldstat.sendEvent("clickAvar")
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    let isAutoPage = getAutoPage()
    let isLastNextBtn = getLastNextBtn()
    this.setData({
      isAutoPage,
      getLastNextBtn
    })
	  app.aldstat.sendEvent("mine")
  },
  
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  tapSwitch: function() {
    let isAutoPage = !this.data.isAutoPage
    setAutoPage(isAutoPage)
    this.setData({
      isAutoPage
    })
  },

  tapLastNext: function() {
    let isLastNextBtn = !this.data.isLastNextBtn
    setLastNextBtn(isLastNextBtn)
    this.setData({
      isLastNextBtn
    })
  },

  tapFeedback: function() {
    wx.navigateTo({
      url: "../../pages/feedback/feedback"
    })
    app.aldstat.sendEvent("feedback")
  },

  onShareAppMessage: function () {
	app.aldstat.sendEvent("share")
    return getShareInfo()
  },
})