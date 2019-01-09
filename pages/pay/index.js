// pages/pay/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payCount: app.globalData.payCount.toFixed(2),
    orderId: '',
    orderSn: '',
    isStandard: 1,
    balance: '0',
    doorFee: '',
    isPaying: false,
    cId: '',
    coupon: { code: '', prices: 0},
    offerPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      payCount: parseFloat(options.count).toFixed(2),
      offerPrice: parseFloat(options.count),
      orderId: options.orderId,
      orderSn: options.orderSn,
      isStandard: parseInt(options.isStandard),
      cId: options.c_id || ''
    })

    if (options.c_id) {
      this.getCoupon()
    }
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

    if (app.globalData.pagePay.coupon.code != '') {
      this.setData({
        coupon: app.globalData.pagePay.coupon,
        payCount: (this.data.offerPrice - app.globalData.pagePay.coupon.prices).toFixed(2)
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

  pay: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      isPaying: true
    }, () => {
      //小程序微信支付获取支付密钥
      var getWxpay = wxRequest.postRequest(path.getWxpay(), {
        order_sn: this.data.orderSn,
        total_fee: this.data.payCount,
        pay_type: 3,
        coupon_code: this.data.coupon.code || null
      });
      getWxpay.then(res => {
        wx.hideLoading()
        if (res.data.status === 1) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false,
            success: function () {
              if (that.data.isStandard) {//标准订单支付
                app.globalData.orderType = 'excuting'
              }
              wx.reLaunch({
                url: '/pages/orders/index',
              })
            }
          })
        } else if (res.data.status === 2) {
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.paySign,
            'complete': function (res) {
              // console.log(that.data.isStandard)
              if (that.data.isStandard) {//标准订单支付
                app.globalData.orderType = 'excuting'
                wx.reLaunch({
                  url: '/pages/orders/index',
                })
              } else {//非标准订单同意报价并支付
                wx.navigateBack()
              }
            },
            'fail': function () {
              if (!that.data.isStandard) {
                var cancelPay = wxRequest.postRequest(path.cancelPay());
                cancelPay.then(cancelPayRes => { })
              }
            }
          })
        } else {
          // wx.showToast({
          //   title: res.data.message,
          // })
          wx.showModal({
            title: '错误',
            content: res.data.message,
            showCancel: false,
            success: function () {
              wx.navigateBack()
            }
          })
        }
      })
    })
  },

  gotoCoupon: function () {
    var url = '../serviceCoupon/index?c_id=' + this.data.cId + '&total=' + this.data.offerPrice + '&from=pay'
    wx.navigateTo({
      url: url,
    })
  },

  getCoupon: function () {
    var that = this
    //查询个人优惠券
    var getCoupon = wxRequest.postRequest(path.getCoupon(), {
      page: 1,
      page_size: 100,
      status: 0 //0为未使用
    });
    getCoupon.then(res => {
      var coupons = res.data.data.list, length = res.data.data.list.length
      var canUse = [], maxSaleOff = 0, finalCoupon = {code: '', prices: 0}

      for (let item of coupons) {
        if (item.service_id.split(',').indexOf(that.data.cId + '') != -1) {
          if (item.prices <= that.data.payCount) {
            canUse.push(item)
          }
        }
      }

      for (let item of canUse) {
        if (item.prices > maxSaleOff) {
          maxSaleOff = item.prices
          finalCoupon = item
        }
      }

      that.setData({
        coupon: {
          code: finalCoupon.coupon_code,
          prices: finalCoupon.prices
        },
        payCount: (that.data.offerPrice - finalCoupon.prices).toFixed(2)
      })
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