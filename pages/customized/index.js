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
    productId: null,
    shopCartCount: 0
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
    this.cartNum()
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

  fifthTap: function ({ currentTarget: { dataset: { id, index, idx } }}) {
    let list = this.data.fourthList
    list[index].child_labels[idx].checked = !list[index].child_labels[idx].checked

    this.setData({
      fourthList: list
    })
  },

  verify: function ({ currentTarget: { dataset: { type } } }) {
    if (wx.getStorageSync('token')) {
      if (!isRegister(app.globalData.isRegister, '该操作需要授权手机号！')) return
    }

    if (!this.data.thirdIndex) {
      wx.showModal({
        title: '提示',
        content: '您还没有选择完整的条件！',
        showCancel: false
      })
      return
    }

    type === 'shop' ? this.addToShopcart() : this.gotoSimAppointment()
  },

  getSelectedLabel: function () {
    let splList = []
    this.data.fourthList.map(item => {
      let hasCheck = false, child_labels = []
      item.child_labels.map(label => {
        if (label.checked) {
          hasCheck = true
          child_labels.push(label)
        }
      })

      if (hasCheck) {
        item.child_labels = child_labels
        splList.push(item)
      }
    })

    return splList
  },

  addToShopcart: function () {
    var that = this
    var post_data = {
      p_id: this.data.thirdList[this.data.thirdIndex - 1].p_id,
      is_standard: 0,
      lables: this.getSelectedLabel()
    };

    var addToShopcart = wxRequest.postRequest(path.addToShopcart(), post_data);
    addToShopcart.then(res => {
      if (res.data.status) {
        wx.hideLoading()
        wx.showToast({
          title: '添加成功！',
          duration: 2000
        })
        that.cartNum()
      }
    })
  },

  gotoSimAppointment: function () {
    app.globalData.pageCustomized.fourthList = this.data.fourthList
    wx.navigateTo({
      url: '../simAppointment/index?id=' + this.data.productId
    })
  },

  cartNum: function () {
    var that = this
    var cartNum = wxRequest.postRequest(path.cartNum(), {
      is_standard: 0
    });

    cartNum.then(res => {
      if (res.data.status) {
        that.setData({
          shopCartCount: res.data.data.count
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