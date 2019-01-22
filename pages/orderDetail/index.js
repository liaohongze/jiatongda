// pages/orderDetail/index.js
var util = require('../../utils/util.js');
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    visible: false,
    payFeeTitle: '感谢费',
    payFee: '',
    status: ['新增', '待报价', '已报价', '待确认', '待上门', '服务中', '服务完成', '已完成', '已评价', '已取消', '已上门'],
    actions: [
      {
        name: '不给感谢费',
        color: '#8c92a2'
      },
      {
        name: '支付感谢费',
        color: '#00c482'
      }
    ],
    files: [],
    comment: {},
    disableCancleBtn: false,
    disableConfirmBtn: false,
    masterList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderById(options.order_id)
    if (options.tab) {
      app.globalData.orderType = options.tab
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
    if (JSON.stringify(this.data.order) != '{}') {
      this.getOrderById(this.data.order.order_id)
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

  // 支付差价弹窗
  showpayDiff: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '支付差价',
      success: function (res) {
        if (res.confirm) {
          var payFee = wxRequest.postRequest(path.payFee(), {
            'order_sn': that.data.order.order_sn,
            'type': 2
          });
          payFee.then(res => {
            if (res.data.status) {
              if (res.data.message == '支付成功') {
                that.getOrderById(that.data.order.order_id)
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                })
              } else if (res.data.message == '获取成功') {
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    that.getOrderById(that.data.order.order_id)
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 2000
                    })
                  },
                  'fail': function (res) {
                    wx.showToast({
                      title: '取消支付',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  payFeeInput: function (e) {
    this.setData({
      payFee: e.detail.value
    })
  },

  showpayFee: function () {
    this.setData({
      visible: true
    })
  },

  // 感谢费
  payFee: function ({ detail }) {
    var that = this

    const index = detail.index
    if (index === 0) {
      // console.log('不给感谢费')
      this.setData({
        visible: false
      })
    } else if (index === 1) {
      // console.log('给感谢费')
      if (that.data.payFee === '') {
        wx.showToast({
          title: '您还没有填写金额',
          icon: 'none',
          duration: 1500
        })
        return;
      }
      var payFee = wxRequest.postRequest(path.payFee(), {
        'order_sn': that.data.order.order_sn,
        'total_fee': that.data.payFee,
        'type': 1
      });
      payFee.then(res => {
        if (res.data.status) {
          if (res.data.message == '支付成功') {
            that.getOrderById(that.data.order.order_id)
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              visible: false
            })
          } else if (res.data.message == '获取成功') {
            // console.log('获取成功')
            wx.requestPayment({
              'timeStamp': res.data.data.timeStamp,
              'nonceStr': res.data.data.nonceStr,
              'package': res.data.data.package,
              'signType': 'MD5',
              'paySign': res.data.data.paySign,
              'success': function (res) {
                that.setData({
                  visible: false
                })
                that.getOrderById(that.data.order.order_id)
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              'fail': function (res) {
                wx.showToast({
                  title: '取消支付',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          }
        }
      })
    }
  },

  // 打电话
  phoneCall: function () {
    const that = this
    wx.makePhoneCall({
      phoneNumber: app.globalData.serviceTel
    })
  },

  // 拨打师傅电话
  callMaster: function ({currentTarget: {dataset: {mobile}}}) {
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },

  //选择图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 3 - that.data.files.length,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var shouldAddImg = true
        res.tempFiles.map(item => {
          if (item.size > 2097152) {
            wx.showToast({
              title: '图片不能大于2兆',
              icon: 'none',
              duration: 2000
            })
            shouldAddImg = false
          }
        })

        if (shouldAddImg) {
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
        }
      }
    })
  },
  //预览图片
  previewImage: function (e) {
    console.log(e.currentTarget.id)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.order.service_img // 需要预览的图片http链接列表
    })
  },
  //评论预览图片
  commentPreview: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.comment.file // 需要预览的图片http链接列表
    })
  },
  //删除图片
  deleteImage: function (event) {
    let arr = this.data.files
    arr.splice(arr.indexOf(event.target.dataset.item), 1)
    this.setData({
      files: arr
    })
  },

  // 获取订单详情
  getOrderById: function (id) {
    var that = this
    var getOrder = wxRequest.postRequest(path.getOrder(), {
      order_id: id
    });
    getOrder.then(res => {
      var order = res.data.data
      order.address_info = JSON.parse(order.address_info)
      order.price_diff = parseFloat(order.price_diff)
      order.create_time = util.formatTimeWithMin(order.create_time)
      if (order.take_address_info) {
        order.take_address_info = JSON.parse(order.take_address_info)
      }
      if (order.service_img) {
        order.service_img = order.service_img.split(',')
      }
      if (res.data.status) {
        that.setData({
          order: order
        })

        if (res.data.data.status == 8) {//如果订单已评价，就请求该订单的评论数据
          that.getOrderComment(id)
        }

        if (res.data.data.status == 2) {//如果订单已报价，获取报价师傅列表
          that.getMasters()
        }
      }
    })
  },

  //获取订单评论
  getOrderComment: function (id) {
    var that = this
    var getOrderComment = wxRequest.postRequest(path.getOrderComment(), {
      order_id: id,
      page: 1,
      page_size: 5
    });
    getOrderComment.then(res => {
      if (res.data.status) {
        var comment = res.data.data.list[0]
        comment.star = JSON.parse(comment.star)
        comment.file = comment.file.split(',')
        that.setData({
          comment: comment
        })
      }
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

  //跳转评价
  addComment: function () {
    wx.navigateTo({
      url: '/pages/evaluate/index?orderId=' + this.data.order.order_id
    })
  },

  // 取消订单
  cancelOrder: function () {
    var that = this
    var content = this.data.order.status === 5 ? '确认取消订单？\r\n由于师傅已上门，如需继续取消订单，系统将从已支付费用中扣除30元的上门费，剩余金额原路返回!' : '确定取消订单？'
    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          that.setData({
            disableCancleBtn: true
          }, () => {
            var cancelOrder = wxRequest.postRequest(path.cancelOrder(), {
              order_id: that.data.order.order_id
            });
            cancelOrder.then(res => {
              if (res.data.status) {
                that.setData({
                  disableCancleBtn: false
                }, () => {
                  wx.showModal({
                    title: '提示',
                    content: '取消订单成功！',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack()
                      }
                    }
                  })
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '取消订单失败！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack()
                    }
                  }
                })
              }
            })
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  confirmIndoor: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认上门后，您如需取消订单，需支付30元上门费作为师傅补偿！',
      success: function (modalRes) {
        if (modalRes.confirm) {
          var confirmIndoor = wxRequest.postRequest(path.confirmIndoor(), {
            order_id: that.data.order.order_id
          });

          confirmIndoor.then(res => {
            if (res.data.status) {
              that.getOrderById(that.data.order.order_id)
              wx.showToast({
                title: '确认上门成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },

  // 确认完成订单
  confirmOrder: function () {
    var that = this
    this.setData({
      disableConfirmBtn: true
    }, () => {
      var sureOrder = wxRequest.postRequest(path.sureOrder(), {
        order_id: this.data.order.order_id
      });
      sureOrder.then(res => {
        if (res.data.status) {
          that.setData({
            disableConfirmBtn: false
          }, () => {
            app.globalData.orderType = 'completed'
            wx.reLaunch({
              url: '/pages/orders/index'
            })
          })
        }
      })
    })
  },

  // 非标准订单同意报价并支付
  agreeAndPay: function (price) {
    var url = '/pages/pay/index?orderId=' + this.data.order.order_id + '&count=' + price + '&orderSn=' + this.data.order.order_sn + '&isStandard=' + this.data.order.is_standard + '&c_id=' + this.data.order.c_id
    wx.navigateTo({
      url: url,
    })
  },

  // 获取报价师傅列表
  getMasters: function () {
    let that = this
    var getMasters = wxRequest.postRequest(path.getMasters(), {
      order_id: this.data.order.order_id
    });
    getMasters.then(res => {
      if (!res.data.status) return
      res.data.data.order_offer_record.map(item => {
        item.quotation_type.split(',').map(type => {
          item[type] = true
        })
      })
      that.setData({
        masterList: res.data.data
      })
    })
  },

  // 确认雇佣师傅
  sureOrderOffer: function ({currentTarget: {id, dataset}}) {
    let that = this
    var sureOrderOffer = wxRequest.postRequest(path.sureOrderOffer(), {
      id: id
    })
    sureOrderOffer.then(res => {
      if (!res.data.status) return
      that.agreeAndPay(dataset.price)
    })
  },

  // 重新下单
  retakeOrder: function () {
    let that = this
    var reloadOrder = wxRequest.postRequest(path.reloadOrder(), {
      order_id: this.data.order.order_id
    })
    reloadOrder.then(res => {
      if (res.data.status) {
        wx.showModal({
          title: '重新下单成功!',
          content: '点击确认到购物车查看',
          success(modalres) {
            if (modalres.confirm) {
              wx.redirectTo({
                url: '/pages/shopCart/index?tab=' + (that.data.order.is_standard ? 1 : 2),
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: "none",
          duration: 2000
        })
      }
    })
    // wx.showToast({
    //   title: '该功能开发中...',
    //   icon: 'none'
    // })
  }
})