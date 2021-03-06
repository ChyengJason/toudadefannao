const { getBookName, storeSubjectDone, getSubjectDone, getShareInfo, getAutoPage, getLastNextBtn } = require('../../utils/util.js')
const { setUserOptions, getUserOptions, getSubjectData, getSubjectCount, addCollect, deleteCollect, checkCollect, clearStore } = require('../../utils/store.js')

const app = getApp()
var touchDot = 0 // 触摸时的原点
var time = 0 // 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = '' // 记录/清理 时间记录
var switchInterval = '' // 记录/清理 切页记录

Page({
  data: {
    isDatiModel: true,
    subject: {},
    rank: 0,
    num: 0,
    rankcount: 0,
    rightAnswerTip: false,
    wrongAnswerTip: false,
    showCommitBtn: false,
    userAnswer: '',
    rightAnswer: '',
    isShowLastNextBtn: false
  },

  $data: {
    bookType: '',
    subjectType: '', // all、single、multi、judge、collect、wrong
    page: 0,
    count: 0,
    hasCheckHistory: false,
    isAutoPage: true,
  },

  onShow: function() {
    wx.setNavigationBarTitle({
      title: getBookName(this.$data.bookType)
    })
    this.setData({
      isShowLastNextBtn: getLastNextBtn()
    })
  },

  onLoad: function (options) {
    clearStore()
    this.$data.bookType = options.bookType
    this.$data.subjectType = options.subjectType
    this.$data.isAutoPage = getAutoPage()
    this.loadPageCount()
  },

  loadPageCount() {
    let { bookType, subjectType } = this.$data
    let self = this
    getSubjectCount(bookType, subjectType, app.getUserid()).then(count => {
      console.log('count', count)
      this.$data.count = count
      if (count <= 0) {
        wx.showModal({
          content: '题目数量为空',
          showCancel: false,
          success: function (res) {
            wx.navigateBack()
          }
        })
      } else {
        this.loadPage()
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({ title: '加载错误' + err })
    }) 
  },

  loadPage() {
    let { bookType, subjectType, page, count } = this.$data
    let self = this
    //console.log('loadPage', page, count)
    if(page >= 0 && page < count) {
      getSubjectData(bookType, subjectType, app.getUserid(), page).then(subject => {
        self.showPage(subject, count)
        self.checkCollect()
        self.checkHistorySubject()
      }).catch(err => {
        console.log(err)
        wx.showToast({ title: '加载错误' + err })
      })
    }
  },

  showPage: function (subject) {
    let { bookType, subjectType, page, count } = this.$data
    let rank = parseInt(page / 100) + 1
    let num = page % 100 + 1
    let rankcount = (page < (parseInt(count / 100) * 100)) ? 100 : (count % 100)
    this.setData({
      subject,
      rank,
      num,
      rankcount,
      rightAnswerTip: false,
      wrongAnswerTip: false,
      userAnswer: '',
      rightAnswer: '',
      showCommitBtn: false,
      //isCollect: false
    })

    if (this.data.isDatiModel) {
      this.showDatiModel()
    } else {
      this.showBetiModel()
    }
  },

  checkCollect() {
    let { bookType } = this.$data
    let { subject } = this.data
    checkCollect(bookType, subject, app.getUserid()).then(res => {
      this.setData({ isCollect: true })
    }).catch(err => {
      console.log(err)
      this.setData({ isCollect: false })
    })
  },

  checkHistorySubject: function () {
    let { hasCheckHistory, bookType, subjectType, page} = this.$data
    if (hasCheckHistory) {
      return
    }
    this.$data.hasCheckHistory = true
    let storePage = getSubjectDone(bookType,subjectType)
    let that = this
    if (!isNaN(storePage) && storePage != page) {
      wx.showModal({
        content: '是否回到上次做题的位置',
        success: function (res) {
          if (res.confirm) {
            that.$data.page = storePage
            that.loadPage()
          } else {
            storeSubjectDone(that.$data.bookType, that.$data.subjectType, that.$data.page)
          }
        }
      })
    }
  },

  onShareAppMessage: function () {
	  app.aldstat.sendEvent("subject_share")
    return getShareInfo()
  },

  tapOptionA: function () {
    let optionA = this.selectComponent("#optionA");
    let { bookType, subjectType, page } = this.$data
    let userOption = getUserOptions(bookType, subjectType, page)
    if (this.data.isDatiModel && typeof (userOption) == "undefined") {
      if (this.data.subject.questionType != 3) {// 单选题或者判断题
        this.commitResult([0])
      } else {
        if (optionA.isShow()) {
          optionA.selectOption()
        } else if (optionA.isSelect()) {
          optionA.showOption()
        }
      }
    }
  },

  tapOptionB: function () {
    let optionB = this.selectComponent("#optionB");
    let { bookType, subjectType, page } = this.$data
    let userOption = getUserOptions(bookType, subjectType, page)
    if (this.data.isDatiModel && typeof (userOption) == "undefined") {
      if (this.data.subject.questionType != 3) {// 单选题或者判断题
        this.commitResult([1])
      } else {
        if (optionB.isShow()) {
          optionB.selectOption()
        } else if (optionB.isSelect()) {
          optionB.showOption()
        }
      }
    }
  },

  tapOptionC: function () {
    let optionC = this.selectComponent("#optionC");
    let { bookType, subjectType, page } = this.$data
    let userOption = getUserOptions(bookType, subjectType, page)
    if (this.data.isDatiModel && typeof (userOption) == "undefined") {
      if (this.data.subject.questionType != 3) {// 单选题或者判断题
        this.commitResult([2])
      } else {
        if (optionC.isShow()) {
          optionC.selectOption()
        } else if (optionC.isSelect()) {
          optionC.showOption()
        }
      }
    }
  },

  tapOptionD: function () {
    let optionD = this.selectComponent("#optionD");
    let { bookType, subjectType, page } = this.$data
    let userOption = getUserOptions(bookType, subjectType, page)
    if (this.data.isDatiModel && typeof (userOption) == "undefined") {
      if (this.data.subject.questionType != 3) {// 单选题或者判断题
        this.commitResult([3])
      } else {
        if (optionD.isShow()) {
          optionD.selectOption()
        } else if (optionD.isSelect()) {
          optionD.showOption()
        }
      }
    }
  },

  tapDati: function () {
    if (!this.data.isDatiModel) {
      this.setData({ isDatiModel: true })
      this.showDatiModel()
    }
	  app.aldstat.sendEvent("subject_dati")
  },

  tapBeiti: function () {
    if (this.data.isDatiModel) {
      this.setData({ isDatiModel: false })
      this.showBetiModel()
    }
	app.aldstat.sendEvent("subject_beiti")
  },

  tapCommit: function () {
    let result = []
    let optionA = this.selectComponent("#optionA");
    let optionB = this.selectComponent("#optionB");
    let optionC = this.selectComponent("#optionC");
    let optionD = this.selectComponent("#optionD");
    if (optionA != null && optionA.isSelect()) {
      result.push(0)
    }
    if (optionB != null && optionB.isSelect()) {
      result.push(1)
    }
    if (optionC != null && optionC.isSelect()) {
      result.push(2)
    }
    if (optionD != null && optionD.isSelect()) {
      result.push(3)
    }
    this.commitResult(result)
  },

  commitResult: function (userOption) {
    wx.vibrateShort()
    if (userOption.length == 0) {
      wx.showToast({
        title: '至少选择一个选项',
        icon: 'none'
      })
      return
    }

    let { bookType, subjectType, page } = this.$data
    this.setData({ showCommitBtn: false })
    storeSubjectDone(bookType, subjectType, page)
    setUserOptions(bookType, subjectType, page, userOption)
    this.showComfirmResult(userOption)
    if (userOption.sort().toString() == this.data.subject.answer.sort().toString()) {
      this.startAutoSwitchPage()
    }
  },

  showComfirmResult: function (userOption) {
    let answer = this.data.subject.answer
    let userAnswer = ''
    let rightAnswer = ''

    let optionA = this.selectComponent("#optionA");
    let existInAnswer = (answer.indexOf(0) != -1)
    let existInUserOption = (userOption.indexOf(0) != -1)
    if (existInAnswer && existInUserOption) {
      optionA.rightResultOption()
      rightAnswer += 'A '
      userAnswer += 'A '
    } else if (existInAnswer) {
      optionA.rightOption()
      rightAnswer += 'A '
    } else if (existInUserOption) {
      optionA.wrongResultOption()
      userAnswer += 'A '
    } else if (optionA != null) {
      optionA.showOption()
    }

    let optionB = this.selectComponent("#optionB");
    existInAnswer = (answer.indexOf(1) != -1)
    existInUserOption = (userOption.indexOf(1) != -1)
    if (existInAnswer && existInUserOption) {
      optionB.rightResultOption()
      rightAnswer += 'B '
      userAnswer += 'B '
    } else if (existInAnswer) {
      optionB.rightOption()
      rightAnswer += 'B '
    } else if (existInUserOption) {
      optionB.wrongResultOption()
      userAnswer += 'B '
    } else if (optionB != null) {
      optionB.showOption()
    }

    let optionC = this.selectComponent("#optionC");
    existInAnswer = (answer.indexOf(2) != -1)
    existInUserOption = (userOption.indexOf(2) != -1)
    if (existInAnswer && existInUserOption) {
      optionC.rightResultOption()
      rightAnswer += 'C '
      userAnswer += 'C '
    } else if (existInAnswer) {
      optionC.rightOption()
      rightAnswer += 'C '
    } else if (existInUserOption) {
      optionC.wrongResultOption()
      userAnswer += 'C '
    } else if (optionC != null) {
      optionC.showOption()
    }

    let optionD = this.selectComponent("#optionD");
    existInAnswer = (answer.indexOf(3) != -1)
    existInUserOption = (userOption.indexOf(3) != -1)
    if (existInAnswer && existInUserOption) {
      optionD.rightResultOption()
      rightAnswer += 'D '
      userAnswer += 'D '
    } else if (existInAnswer) {
      optionD.rightOption()
      rightAnswer += 'D '
    } else if (existInUserOption) {
      optionD.wrongResultOption()
      userAnswer += 'D '
    } else if (optionD != null) {
      optionD.showOption()
    }

    let rightAnswerTip = userOption.sort().toString() == answer.sort().toString()
    let wrongAnswerTip = !rightAnswerTip
    this.setData({
      rightAnswerTip,
      wrongAnswerTip,
      userAnswer,
      rightAnswer
    })
  },

  startAutoSwitchPage: function () {
    let { page, count, isAutoPage} = this.$data
    page++;
    let self = this
    if (isAutoPage && page < count) {
      switchInterval = setInterval(function () {
        self.$data.page = page
        self.loadPage()
        clearInterval(switchInterval)
      }, 500)
    }
  },

  showDatiModel: function () {
    let { bookType, subjectType, page } = this.$data
    let userOption = getUserOptions(bookType, subjectType, page)
    if (typeof (userOption) != "undefined") {
      // 已经答过题
      this.showComfirmResult(userOption)
    } else {
      this.recoverOptions()
      if (this.data.subject.questionType == 3) {
        this.setData({ showCommitBtn: true })
      }
    }

  },

  showBetiModel: function () {
    let answer = this.data.subject.answer
    let optionA = this.selectComponent("#optionA");
    if (answer.indexOf(0) != -1) {
      optionA.rightOption()
    } else if (optionA != null) {
      optionA.showOption()
    }
    let optionB = this.selectComponent("#optionB");
    if (answer.indexOf(1) != -1) {
      optionB.rightOption()
    } else if (optionB != null) {
      optionB.showOption()
    }
    let optionC = this.selectComponent("#optionC");
    if (answer.indexOf(2) != -1) {
      optionC.rightOption()
    } else if (optionC != null) {
      optionC.showOption()
    }
    let optionD = this.selectComponent("#optionD");
    if (answer.indexOf(3) != -1) {
      optionD.rightOption()
    } else if (optionD != null) {
      optionD.showOption()
    }
    this.setData({ showCommitBtn: false })
  },


  recoverOptions: function () {
    let optionA = this.selectComponent("#optionA");
    if (optionA != null) { optionA.showOption() }
    let optionB = this.selectComponent("#optionB");
    if (optionB != null) { optionB.showOption() }
    let optionC = this.selectComponent("#optionC");
    if (optionC != null) { optionC.showOption() }
    let optionD = this.selectComponent("#optionD");
    if (optionD != null) { optionD.showOption() }
  },

  tapCollect: function() {
    let { isCollect, subject } = this.data
    let { bookType } = this.$data

    let func = isCollect ? deleteCollect : addCollect
    wx.showLoading({ title:"正在处理" })
    func(this.$data.bookType, subject, app.getUserid()).then((res) => {
      this.setData({ isCollect: !isCollect }) 
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: !isCollect ? '收藏失败' : '移除失败'
      })
    })
    app.aldstat.sendEvent(!isCollect ? "subject_collect" : "subject_uncollect")
  },

  tapSheet: function() {
    let { bookType, subjectType, page } = this.$data
	  wx.navigateTo({
      url: "../../pages/sheet/sheet?bookType=" + bookType + "&subjectType=" + subjectType + "&page=" + page
	  })
	  app.aldstat.sendEvent("subject_sheet")
  },

  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用 js 计时器记录时间 
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  touchEnd: function (e) {
    var that = this;
    var touchMove = e.changedTouches[0].pageX;
    var moveIndex = e.currentTarget.dataset.tab;
    // 向左滑动 
    if (touchMove - touchDot <= -40 && time < 10) {
      console.log('左边')
      this.showNextSubject()
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 10) {
      console.log('右边')
      this.showLastSubject()
    }
    clearInterval(interval); // 清除 setInterval
    time = 0;
  },

  tapLastSubject: function() {
    wx.vibrateShort()
    this.showLastSubject()
    app.aldstat.sendEvent("tap_last_collect")
  },

  tapNextSubject: function() {
    wx.vibrateShort()
    this.showNextSubject()
    app.aldstat.sendEvent("tap_next_collect")
  },
  
  showLastSubject: function () {
    let { page, count } = this.$data
    page = page - 1
    if (page >= 0) {
      this.$data.page = page
      this.loadPage()
    } else {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none',
        duration: 500
      })
    }
  },

  showNextSubject: function () {
    let { page, count} = this.$data
    page = page + 1
    if (page < count) {
      this.$data.page = page
      this.loadPage()
    } else {
      wx.showToast({
        title: '没有更多了! ',
        icon: 'none',
        duration: 500
      })
    }
  },
})