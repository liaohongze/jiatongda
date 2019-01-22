// pages/coupon/index.js
var path = require('../../utils/api.js');
var util = require('../../utils/util.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    isLoading: true,
    currentPage1: 1,
    currentPage2: 1,
    currentPage3: 1,
    totalPage1: 1,
    totalPage2: 1,
    totalPage3: 1,
    pageSize: 10,
    showNoMore: false,
    notused: [],
    used: [],
    invalid: [],
    couponCode: ''
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
    this.getCoupon(this.data.currentPage1, 0)
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
    if (!this.data.isLoading) {
      var status, page, totalPage
      if (this.data.current == 'tab1') {
        status = 0
        page = this.data.currentPage1
        totalPage = this.data.totalPage1
      } else if (this.data.current == 'tab2') {
        status = 4
        page = this.data.currentPage2
        totalPage = this.data.totalPage2
      } else if (this.data.current == 'tab3') {
        status = 3
        page = this.data.currentPage3
        totalPage = this.data.totalPage3
      }

      if (page <= totalPage) {
        this.getCoupon(page, status)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  codeChange: function (e) {
    this.setData({
      couponCode: e.detail.value
    })
  },

  exchange: function () {
    var that = this
    //根据优惠券码兑换优惠券
    var exchangeCoupon = wxRequest.postRequest(path.exchangeCoupon(), {
      coupon_code: this.data.couponCode
    });
    exchangeCoupon.then(res => {
      if (res.data.status) {
        that.setData({
          currentPage1: 1,
          totalPage1: 1,
          couponCode: '',
          notused: []
        }, () => {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
          that.getCoupon(that.data.currentPage1, 0)
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  handleChange({ detail }) {
    if (!this.data.isLoading) {/* 加载数据时禁止切换tab */
      var status, page
      if (detail.key == 'tab1') {
        status = 0
        page = this.data.currentPage1
      } else if (detail.key == 'tab2') {
        status = 4
        page = this.data.currentPage2
      } else if (detail.key == 'tab3') {
        status = 3
        page = this.data.currentPage3
      }

      if (page == 1) { //第一次切换到该标签时加载该标签的数据
        this.getCoupon(page, status)
      }

      this.setData({
        current: detail.key
      });
    }
  },

  getCoupon: function(page, status) {
    var that = this
    //查询个人优惠券
    var getCoupon = wxRequest.postRequest(path.getCoupon(), {
      page: page,
      page_size: that.data.pageSize,
      status: status,
      ed: status === 3 ? 1 : null
    });
    getCoupon.then(res => {
      // console.log(res)
      var couponList
      if (res.data.status) {
        var totalPage = Math.ceil(res.data.data.count / that.data.pageSize)
        couponList = res.data.data.list
        console.log(couponList);
        for (var i = 0; i < couponList.length; i++) {//格式化时间
          couponList[i].coupon_start_time = util.formatTime(couponList[i].coupon_start_time)
          couponList[i].coupon_end_time = util.formatTime(couponList[i].coupon_end_time)
        }

        if (status == 0) {
          couponList = [...that.data.notused, ...couponList]
          that.setData({
            notused: couponList,
            totalPage1: totalPage,
            currentPage1: page + 1
          })
        } else if (status == 4) {
          couponList = [...that.data.used, ...couponList]
          that.setData({
            used: couponList,
            totalPage2: totalPage,
            currentPage2: page + 1
          })
        } else if (status == 3) {
          couponList = [...that.data.invalid, ...couponList]
          that.setData({
            invalid: couponList,
            totalPage3: totalPage,
            currentPage3: page + 1
          })
        }

        that.setData({
          isLoading: false,
          showNoMore: (page + 1) > totalPage ? true : false
        })
      }
    })
  }
})