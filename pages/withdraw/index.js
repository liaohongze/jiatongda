// pages/withdraw/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    code: '',
    endNum: '',
    balance: '',
    cash: 0,
    countPlaceHolder: '',
    seriveCharge: '0',
    rate: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.userInfo()
    this.getPlaceholder()

    if (JSON.stringify(app.globalData.pageCards) != '{}') {
      this.setData({
        name: app.globalData.pageCards.name,
        code: app.globalData.pageCards.code,
        endNum: app.globalData.pageCards.end
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  inputChange: function (e) {
    this.setData({
      cash: parseFloat(e.detail.value),
      seriveCharge: (parseFloat(e.detail.value) * this.data.rate).toFixed(2)
    })
  },

  userInfo: function () {
    var that = this
    //查询用户信息
    var userinfo = wxRequest.postRequest(path.userinfo());
    userinfo.then(res => {
      if (res.data.status) {
        that.setData({
          balance: res.data.data.user_info.balance
        })
      }
    })
  },

  getPlaceholder: function () {
    var that = this
    //查询提现提示信息
    var getWithdrawTip = wxRequest.postRequest(path.getWithdrawTip());
    getWithdrawTip.then(res => {
      if (res.data.status) {
        that.setData({
          countPlaceHolder: parseInt(res.data.data.all_cash_limit.value),
          rate: parseFloat(res.data.data.cash.value)
        })
      }
    })
  },

  withdraw: function () {
    if (this.data.name == '' && this.data.code == '') {
      wx.showToast({
        title: '您还未选择银行卡',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (parseInt(this.data.cash) < 200) {
      wx.showToast({
        title: '提现金额不能小于200',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if ((this.data.cash - this.data.seriveCharge) > parseFloat(this.data.balance)) {
      wx.showToast({
        title: '提现金额不能大于账户余额',
        icon: 'none',
        duration: 2000
      })
      return
    }

    var that = this
    //客户端提现
    var getCash = wxRequest.postRequest(path.getCash(), {
      bank_name: that.data.name,
      cash: that.data.cash + '',
      bank_code: that.data.code
    });
    getCash.then(res => {
      console.log(res)
      if (res.data.status) {
        that.setData({
          name: '',
          code: '',
          endNum: '',
          cash: 0
        }, () => {
          wx.navigateBack()
        })
      }
    })
  },

  // 获取formid
  formSubmit: function (e) {
    var getFormId = wxRequest.postRequest(path.getFormId(), {
      formid: e.detail.formId
    });
    getFormId.then(res => {
      // console.log(res)
    })
  }
})