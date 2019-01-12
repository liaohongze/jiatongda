// pages/customized/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var { isRegister } = require('../../models/isRegister.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstList: [],
    secondList: [],
    thirdList: [],
    fourthList: [],
    firstIndex: 0,
    secondIndex: 0,
    thirdIndex: 0,
    fourthIndex: 0,
    fifthIndex: 0,
    productId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取一级分类
    var selectServiceGroup = wxRequest.postRequest(path.selectServiceGroup(), {
      up: 1
    });
    selectServiceGroup.then(res => {
      if (res.data.status) {
        that.setData({
          firstList: res.data.data.list
        })
      }
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

  selectFirstStep: function (e) {
    var that = this
    var selectServiceCategory = wxRequest.postRequest(path.selectServiceCategory(), {
      g_id: e.target.id,
      all: 1
    });
    selectServiceCategory.then(res => {
      if (res.data.status) {
        that.setData({
          firstIndex: e.currentTarget.dataset.i,
          secondList: res.data.data.list,
          secondIndex: 0,
          thirdIndex: 0,
          fourthIndex: 0
        })
      }
    })
  },

  selectSecondStep: function (e) {
    var that = this
    var selectServiceProduct = wxRequest.postRequest(path.selectServiceProduct(), {
      category_id: e.target.id,
      up:1
    });
    selectServiceProduct.then(res => {
      if (res.data.status) {
        that.setData({
          secondIndex: e.currentTarget.dataset.i,
          thirdList: res.data.data.data,
          thirdIndex: 0,
          fourthIndex: 0
        })
      }
    })
  },

  selectThirdStep: function (e) {
    var that = this
    var productLabels = wxRequest.postRequest(path.productLabels(), {
      product_id: e.target.id
    });
    productLabels.then(res => {
      if (res.data.status) {
        that.setData({
          thirdIndex: e.currentTarget.dataset.i,
          productId: e.target.id,
          fourthList: res.data.data.list
        })
      }
    })
    // this.setData({
    //   thirdIndex: e.currentTarget.dataset.i,
    //   productId: e.target.id
    // })
  },

  gotoSimAppointment: function () {
    if (wx.getStorageSync('token')) {
      if (!isRegister(app.globalData.isRegister, '该操作需要授权手机号！')) return
    }
    wx.navigateTo({
      url: '../simAppointment/index?id=' + this.data.productId
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