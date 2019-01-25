// pages/shopcartPay/index.js
import regeneratorRuntime from '../../utils/runtime.js'
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payCount: 0,
    balance: '0',
    isPaying: false,
    orderAllSn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderAllSn: options.sn,
      payCount: parseFloat(options.total)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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

  pay: async function () {
    var payRes = await wxRequest.postRequest(path.shopcartPay(), {
      order_all_sn: this.data.orderAllSn
    });

    let that = this

    if (payRes.data.status == 1) {
      wx.showModal({
        title: '提示',
        content: '支付成功！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            app.globalData.orderType = 'excuting'
            wx.reLaunch({
              url: '/pages/orders/index'
            })
          }
        }
      })
    } else if (payRes.data.status == -1) {
      wx.showModal({
        title: '提示',
        content: payRes.data.message,
        success: function (res) {
          if (res.confirm) {
            that.recharge(payRes.data.data.need_pay)
          }
        }
      })
    }
  },

  recharge: function (money) {
    var that = this
    var userRechargeInit = wxRequest.postRequest(path.userRechargeInit(), {
      money: money,
      rechargeType: 2,
      cart_sn: this.data.orderAllSn
    });
    userRechargeInit.then(res => {
      if (res.data.status) {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            that.pay()
          },
          fail: function (res) {
            wx.showToast({
              title: '取消支付',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },

  // 获取formid
  formSubmit: function (e) {
    var that = this
    var getFormId = wxRequest.postRequest(path.getFormId(), {
      formid: e.detail.formId
    });
    getFormId.then(res => {
      // console.log(res)
    })
  }
})