// pages/serviceCoupon/index.js
var app = getApp()
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canUse: [],
    unUseful: [],
    cId: '',
    total: 0,
    fromPage: 'pay'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cId: options.c_id,
      total: parseFloat(options.total),
      fromPage: options.from
    }, () => {
      this.getCoupon()
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
      var canUse = [], unUseful = []
      
      for (let i = 0; i < length; i++) {//格式化时间
        coupons[i].coupon_start_time = util.formatTime(coupons[i].coupon_start_time)
        coupons[i].coupon_end_time = util.formatTime(coupons[i].coupon_end_time)
      }

      for (let item of coupons) {
        if (item.service_id.split(',').indexOf(that.data.cId + '') != -1) {
          if (item.prices <= that.data.total) {//过滤优惠劵价格大于订单价格的
            canUse.push(item)
          } else {
            unUseful.push(item)
          }
        } else {
          unUseful.push(item)
        }
      }

      that.setData({
        canUse: canUse,
        unUseful: unUseful
      })
    })
  },

  selectCoupon: function (e) {
    if (this.data.fromPage === 'pay') {
      app.globalData.pagePay.coupon = {
        code: e.currentTarget.dataset.code,
        prices: e.currentTarget.dataset.price
      }
    }
    //  else {
    //   app.globalData.pageAppointment.coupon = {
    //     id: e.currentTarget.id,
    //     count: e.currentTarget.dataset.price
    //   }
    // }

    wx.navigateBack()
  }
})