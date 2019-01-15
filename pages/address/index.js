// pages/address/index.js
var app = getApp()
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrList: [],
    noAddress: false,
    fromPage: '',
    productid: '',
    idx: '',
    addrtype: '',
    adcode: '',
    actions: [
      {
        name: '删除',
        color: '#fff',
        fontsize: '20',
        width: 100,
        icon: 'close',
        background: '#ed3f14'
      }
    ],
    toggle2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromPage: options.from,
      productid: options.id
    })

    if (options.from === 'shopCart') {
      this.setData({
        idx: options.idx,
        addrtype: options.addrtype
      })
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
    this.getAddress()
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

  getAddress: function () {
    var that = this
    //客户端检索对应产品可以使用的地址
    var addressList = wxRequest.postRequest(path.addressList(), {
      product_id: that.data.productid
    });
    addressList.then(res => {
      if (res.data.status) {
        if (JSON.stringify(res.data.data) == '{}') {
          that.setData({
            noAddress: true
          })
        } else {
          that.setData({
            addrList: res.data.data.list,
            noAddress: false
          })
        }
      }
    })
  },

  edit: function (e) {
    app.globalData.editAddr = this.data.addrList[e.target.dataset.i]
    wx.navigateTo({
      url: '/pages/addAddr/index?edit=true',
    })
  },

  showModal: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      confirmColor: '#f74d4c',
      success: function (res) {
        if (res.confirm) {
          that.removeAddr(e.target.id, e.target.dataset.i)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  removeAddr: function (id, index) {
    var that = this
    //删除某条地址
    var deleteAddr = wxRequest.postRequest(path.deleteAddr(), {
      address_id: id
    });
    deleteAddr.then(res => {
      // console.log(res)
      if (res.data.status) {
        var list = that.data.addrList
        if (list.length == 1) {
          that.setData({
            noAddress: true
          })
        }
        list.splice(index, 1)
        that.setData({
          addrList: list
        })
      }
    })
  },

  selectAddr: function (e) {
    var data = e.currentTarget.dataset
    if (data.canuse) {
      var obj = {}
      obj.name = data.name
      obj.mobile = data.mobile
      obj.address = data.address
      obj.id = e.currentTarget.id
      obj.lat = data.lat
      obj.lng = data.lng
      app.globalData.pageAddress = obj

      if (this.data.fromPage == 'startAddr') {
        app.globalData.pageAppointment.startAddr = obj
      } else if (this.data.fromPage == 'endAddr') {
        app.globalData.pageAppointment.endAddr = obj
      } else if (this.data.fromPage == 'simAppoint') {
        app.globalData.pageSimAppoint.address = obj
      } else if (this.data.fromPage == 'shopCart') {
        app.globalData.pageShopCart.address.idx = this.data.idx
        app.globalData.pageShopCart.address.addrtype = this.data.addrtype
        app.globalData.pageShopCart.address.addr = obj
      }
      wx.navigateBack()
    } else {
      wx.showToast({
        title: '您选择的地址不在服务范围内，请重新选择！',
        icon: 'none',
        duration: 3000
      })
    }
  },

  handlerCloseButton() {
    this.setData({
      toggle2: this.data.toggle2 ? false : true
    });
  },

  addr: function (e) {
    console.log(e)
  },

  addAddr: function () {
    wx.navigateTo({
      url: '../addAddr/index',
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