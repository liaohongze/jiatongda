// pages/recommender/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reCode: '',
    hasbind: true,
    disableBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.hasBind()
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

  reCodeChange: function (e) {
    this.setData({
      reCode: e.detail.value
    })
  },

  hasBind: function () {
    var that = this
    var hasbind = wxRequest.postRequest(path.hasBind())
    hasbind.then(res => {
      if (res.data.data.has) {
        that.setData({
          hasbind: true
        })
        that.getReCode()
      } else {
        that.setData({
          hasbind: false,
          disableBtn: false
        })
      }
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
  },

  save: function () {
    var that = this
    this.setData({
      disableBtn: true
    }, () => {
      var bindParent = wxRequest.postRequest(path.bindParent())
      bindParent.then(res => {
        if (res.data.status) {
          wx.showToast({
            title: '绑定成功！',
            duration: 2500
          })
          that.hasBind()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
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
  },
})