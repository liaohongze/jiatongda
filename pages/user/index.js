// pages/user/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
import regeneratorRuntime from '../../utils/runtime.js'
var {isRegister} = require('../../models/isRegister.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatar: '',
    nickName: '',
    couponNum: 0,
    collecitionNum: 0,
    serviceTel: '',
    generalization: null,
    reCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatar: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName,
      serviceTel: app.globalData.serviceTel
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
    if (wx.getStorageSync('token')) {
      if (!isRegister(app.globalData.isRegister, '该页面需要授权手机号！')) return
    }
    var that = this
    //查询用户信息
    var userinfo = wxRequest.postRequest(path.userinfo());
    userinfo.then(res => {
      if (res.data.status) {
        that.setData({
          userInfo: res.data.data.user_info,
          collecitionNum: res.data.data.colection_info.length,
          generalization: res.data.data.generalization
        })
      }
    })

    that.getCoupon()
    that.getReCode()
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

  // 打电话
  phoneCall: function () {
    const that = this
    wx.makePhoneCall({
      phoneNumber: that.data.serviceTel
    })
  },

  gotoOrder: function (e) {
    app.globalData.orderType = e.currentTarget.dataset.type
    wx.reLaunch({
      url: '/pages/orders/index'
    })
  },

  getCoupon: async function () {
    //查询个人优惠券
    var getCoupon = await wxRequest.postRequest(path.getCoupon(), {
      page: 1,
      page_size: 10,
      status: 0
    });
    this.setData({
      couponNum: getCoupon.data.data.count
    })
  },

  previewImage: function () {
    wx.previewImage({
      urls: [this.data.generalization.qrcode],
      current: this.data.generalization.qrcode
    })
  },

  getReCode: function () {
    var that = this
    var getRememberNo = wxRequest.postRequest(path.getRememberNo())
    getRememberNo.then(res => {
      if (res.data.status) {
        that.setData({
          reCode: res.data.data.code
        })
      }
    })
  }
})