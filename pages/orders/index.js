// pages/orders/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var { isRegister } = require('../../models/isRegister.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   * 已取消订单是二期加入的，为了不动之前的代码，cancel对应的是currentPage5和totalPage5
   */
  data: {
    current: 'tab1',
    isLoading: true,
    currentPage1: 1,
    currentPage2: 1,
    currentPage3: 1,
    currentPage4: 1,
    currentPage5: 1,
    totalPage1: 1,
    totalPage2: 1,
    totalPage3: 1,
    totalPage4: 1,
    totalPage5: 1,
    pageSize: 10,
    showNoMore: false,
    status: ['新增', '待报价', '已报价', '待确认', '待上门', '服务中', '服务完成', '已完成', '已评价', '已取消', '已上门'],
    task: [],
    excuting: [],
    completed: [],
    allOrder: [],
    cancel: []
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
  onShow: function () {
    if (wx.getStorageSync('token')) {
      if (!isRegister(app.globalData.isRegister, '该页面需要授权手机号！')) return
    }
    var tab = '', page, status, isStandard
    this.setData({
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      currentPage4: 1,
      currentPage5: 1,
      totalPage1: 1,
      totalPage2: 1,
      totalPage3: 1,
      totalPage4: 1,
      totalPage5: 1,
      task: [],
      excuting: [],
      completed: [],
      allOrder: [],
      cancel: []
    }, () => {
      if (app.globalData.orderType != '') {
        if (app.globalData.orderType == 'excuting') {
          tab = 'tab2'
          page = this.data.currentPage2
          status = '-1,3,4,5,6,-5'
          isStandard = null
        } else if (app.globalData.orderType == 'completed') {
          tab = 'tab3'
          page = this.data.currentPage3
          status = '7,8'
          isStandard = null
        } else if (app.globalData.orderType == 'all') {
          tab = 'tab4'
          page = this.data.currentPage4
          status = '-2'
          isStandard = -2
        } else if (app.globalData.orderType == 'cancel') {
          tab = 'tab5'
          page = this.data.currentPage5
          status = '9'
          isStandard = null
        }
      } else {
        tab = 'tab1'
        page = this.data.currentPage1
        status = '-1,1,2'
        isStandard = -1
      }
      app.globalData.orderType = ''

      // if (page == 1) {//第一次切换到该标签时加载该标签的数据
      this.getOrders(page, status, isStandard)
      // }

      this.setData({
        current: tab
      });
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
    var that = this
    if (!this.data.isLoading) {
      //重置页面数据
      this.setData({
        isLoading: true,
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        currentPage4: 1,
        currentPage5: 1,
        totalPage1: 1,
        totalPage2: 1,
        totalPage3: 1,
        totalPage4: 1,
        totalPage5: 1,
        showNoMore: false,
        task: [],
        excuting: [],
        completed: [],
        allOrder: [],
        cancel: []
      }, () => {
        var page, status, isStandard
        if (that.data.current == 'tab1') {
          page = that.data.currentPage1
          status = '-1,1,2'
          isStandard = -1
        } else if (that.data.current == 'tab2') {
          status = '-1,3,4,5,6,-5'
          isStandard = null
          page = this.data.currentPage2
        } else if (that.data.current == 'tab3') {
          status = '7,8'
          isStandard = null
          page = this.data.currentPage3
        } else if (that.data.current == 'tab4') {
          status = '-2'
          isStandard = -2
          page = this.data.currentPage4
        } else if (that.data.current == 'tab5') {
          status = '9'
          isStandard = null
          page = this.data.currentPage5
        }

        that.getOrders(page, status, isStandard, 1)
      })
    }
    //  else {
    //   wx.stopPullDownRefresh()
    // }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isLoading) {
      var status, page, totalPage, isStandard
      if (this.data.current == 'tab1') {
        status = '-1,1,2'
        isStandard = -1
        page = this.data.currentPage1
        totalPage = this.data.totalPage1
      } else if (this.data.current == 'tab2') {
        status = '-1,3,4,5,6,-5'
        isStandard = null
        page = this.data.currentPage2
        totalPage = this.data.totalPage2
      } else if (this.data.current == 'tab3') {
        status = '7,8'
        isStandard = null
        page = this.data.currentPage3
        totalPage = this.data.totalPage3
      } else if (this.data.current == 'tab4') {
        status = '-2'
        isStandard = -2
        page = this.data.currentPage4
        totalPage = this.data.totalPage4
      } else if (this.data.current == 'tab5') {
        status = '9'
        isStandard = null
        page = this.data.currentPage5
        totalPage = this.data.totalPage5
      }

      if (page <= totalPage) {
        this.getOrders(page, status, isStandard)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // tab切换
  tabsChange({ detail }) {
    if (!this.data.isLoading) {/* 加载数据时禁止切换tab */
      var status, page, isStandard
      if (detail.key == 'tab1') {//全部非标准订单
        status = '-1,1,2'
        isStandard = -1
        page = this.data.currentPage1
      } else if (detail.key == 'tab2') {//标准产品的订单（新增，待确认，待上门，服务中，服务完成）
        status = '-1,3,4,5,6,-5'
        isStandard = null
        page = this.data.currentPage2
      } else if (detail.key == 'tab3') {//历史已完成订单（已完成，已评价）
        status = '7,8'
        isStandard = null
        page = this.data.currentPage3
      } else if (detail.key == 'tab4') {//包含所有任务和订单
        status = '-2'
        isStandard = -2
        page = this.data.currentPage4
      } else if (detail.key == 'tab5') {//已取消订单
        status = '9'
        isStandard = null
        page = this.data.currentPage5
      }

      if (page == 1) {//第一次切换到该标签时加载该标签的数据
        this.getOrders(page, status, isStandard)
      }

      this.setData({
        current: detail.key
      });
    }
  },

  getOrders: function (page, status, isStandard, stopRefresh) {
    var that = this
    var getOrders = wxRequest.postRequest(path.getOrders(), {
      page: page,
      page_size: this.data.pageSize,
      status: status,
      is_standard: isStandard
    });
    getOrders.then(res => {
      if (res.data.status) {
        var totalPage = Math.ceil(res.data.data.count / that.data.pageSize)
        var orderList = res.data.data.order_info
        for (var i=0; i<orderList.length; i++) {
          orderList[i].address_info = JSON.parse(orderList[i].address_info)
        }
        if (status == '-1,1,2' && isStandard == -1) {
          that.setData({
            task: [...that.data.task, ...orderList],
            totalPage1: totalPage,
            currentPage1: page + 1
          })
        } else if (status == '-1,3,4,5,6,-5') {
          that.setData({
            excuting: [...that.data.excuting, ...orderList],
            totalPage2: totalPage,
            currentPage2: page + 1
          })
        } else if (status == '7,8') {
          that.setData({
            completed: [...that.data.completed, ...orderList],
            totalPage3: totalPage,
            currentPage3: page + 1
          })
        } else if (status == '-2' && isStandard == -2) {
          that.setData({
            allOrder: [...that.data.allOrder, ...orderList],
            totalPage4: totalPage,
            currentPage4: page + 1
          })
        } else if (status == '9' && isStandard == null) {
          that.setData({
            cancel: [...that.data.cancel, ...orderList],
            totalPage5: totalPage,
            currentPage5: page + 1
          })
        }

        that.setData({
          isLoading: false,
          showNoMore: (page + 1) > totalPage ? true : false
        }, () => {
          if (stopRefresh) {
            wx.stopPullDownRefresh()
          }
        })
      }
    })
  },

  // 非标准订单同意报价并支付
  agreeAndPay: function (e) {
    var url = '/pages/pay/index?orderId=' + e.currentTarget.dataset.id + '&count=' + e.currentTarget.dataset.count + '&orderSn=' + e.currentTarget.dataset.sn + '&isStandard=' + e.currentTarget.dataset.standard + '&c_id=' + e.currentTarget.dataset.cid
    wx.navigateTo({
      url: url
    })
  }
})