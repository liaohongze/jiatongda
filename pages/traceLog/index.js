// pages/traceLog/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    finalType: {'profit_get_one': '一级分佣', 'profit_get_two': '二级分佣', 'profit_get':'分佣','withdraw': '余额提现', 'deposit': '押金', 'order': '订单', 'thank_fee': '感谢费', 'price_diff': '差价', 'profit': '系统奖励', 'order_blance_refund': '订单退款余额', 'order_wx_refund': '订单微信退款', 'refund_user_money': '退款余额', 'refund_wx_money': '微信退款', 'thank_fee_refund': '感谢费退款', 'price_diff_refund': '差价退款', 'system_send': '系统充钱', 'thank_fee_wx_refund': '感谢费微信退款', 'diff_wx_refund': '差价微信退款', 'master_door_fee': '上工费', 'tank_fee_blance_refund': '感谢费余额退款', 'diff_blance_refund': '差价余额退款', 'store_cash': '门店提现', 'area_commission': '区域商佣金', 'platform_commission': '平台佣金', 'store_commission': '门店佣金', 'withdraw_deposit': '押金提现', 'master_in': '师傅服务收入', 'refund_user_money_and_door': '订单余额退款', 'refund_wx_and_door': '订单微信退款', 'order_blance': "订单余额付款", "order_wx": "订单微信付款", "spend_coupon": "购买优惠券", "pend_coupon":"购买优惠券" ,"recharge": "微信充值余额"},
    profitType: ['门店推荐会员注册奖励', '会员首单奖励门店', '门店推荐师傅', '师傅首单奖励门店', '师傅入驻奖励', '师傅首单奖励师傅', '会员推荐会员注册奖', '会员推荐会员首单奖', '师傅第二至第十个订单奖励'],
    isLoading: true,
    currentPage: 1,
    totalPage: 1,
    showNoMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTraceLog()
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
    if (!this.data.isLoading) {
      if (this.data.currentPage <= this.data.totalPage) {
        this.getTraceLog()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getTraceLog: function () {
    var that = this
    var traceLog = wxRequest.postRequest(path.traceLog(), {
      page: that.data.currentPage,
      page_size: 20
    });
    traceLog.then(res => {
      // console.log(res)
      if (res.data.status) {
        res.data.data.list.map(item => {
          item.on_time = util.formatTime(item.on_time)
          if (item.obj_type === 'order_wx_refund' || item.obj_type === 'refund_wx_money' || item.obj_type === 'thank_fee_wx_refund' || item.obj_type === 'diff_wx_refund') {
            item.balance = '--'
          }
          if (item.obj_type === 'withdraw' || item.obj_type === 'deposit' || item.obj_type === 'order' || item.obj_type === 'thank_fee' || item.obj_type === 'price_diff' || item.obj_type === 'master_door_fee' || item.obj_type === 'store_cash' || item.obj_type === 'withdraw_deposit') {
            item.fina_cash = '-' + item.fina_cash
          }
        })
        that.setData({
          result: [...that.data.result, ...res.data.data.list],
          totalPage: Math.ceil(res.data.data.count / 20),
          isLoading: false,
          currentPage: that.data.currentPage + 1,
          showNoMore: that.data.currentPage + 1 > Math.ceil(res.data.data.count / 20) ? true : false
        })
      }
    })
  }
})