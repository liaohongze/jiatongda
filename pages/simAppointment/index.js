// pages/simAppointment/index.js
var app = getApp()
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: [0, 0],
    time: [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], ['00', '30']],
    order: {},
    product: {},
    startDate: '', //用于时间选择器的开始时间
    endDate: '', //用于时间选择器的结束时间
    files: [],
    expected: 0,
    shopCartCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var reset = {
      productId: '',
      address: {},
      date: '',
      time: '',
      msg: ''
    }
    app.globalData.pageSimAppoint = reset
    app.globalData.pageSimAppoint.productId = options.id

    //通过id获取产品信息
    this.getProductById(options.id)

    //设定日期，开始日期为当前日期，为期一年
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var hour = myDate.getHours();
    var minutes = myDate.getMinutes();

    if (month < 10) {
      month = '0' + month
    }

    if (minutes > 30) {
      var count = hour + 1
      if (count === 24) {
        day = day + 1
      }
    }

    if (day < 10) {
      day = '0' + day
    }

    this.setData({
      startDate: year + '-' + month + '-' + day,
      endDate: year + 1 + '-' + month + '-' + day
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      order: app.globalData.pageSimAppoint
    })
    this.cartNum()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  expectedChange: function (e) {
    this.setData({
      expected: e.detail.value
    })
  },

  getProductById: function(id) {
    var that = this
    //获取服务类下的某产品信息获取服务类下的某产品信息[规格类型等]
    var getProduct = wxRequest.postRequest(path.getProduct(), {
      product_id: id
    });
    getProduct.then(res => {
      if (res.data.status) {
        that.setData({
          product: res.data.data
        }, () => {
          if (app.globalData.pageCustomized.fourthList.length) {
            let product = this.data.product
            product.labels = app.globalData.pageCustomized.fourthList
            this.setData({
              product
            })
          }
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

  bindDateChange: function (e) {
    app.globalData.pageSimAppoint.date = e.detail.value
    this.setData({
      order: app.globalData.pageSimAppoint
    })
  },

  bindTimeChange: function (e) {
    app.globalData.pageSimAppoint.time = this.data.time[0][e.detail.value[0]] + ':' + this.data.time[1][e.detail.value[1]]
    this.setData({
      order: app.globalData.pageSimAppoint
    })
  },

  clickTimePicker: function () {
    if (this.data.order.date === '') {
      wx.showToast({
        title: '请先选择日期！',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    if (this.data.order.date === this.data.startDate) {
      var myDate = new Date();
      var hour = myDate.getHours();
      var minutes = myDate.getMinutes();
      let timeHour = [], timeMin = [], count = 0

      if (minutes > 30) {
        count = hour + 1
        timeMin = ['00', '30']
      } else {
        count = hour
        timeMin = ['30']
      }
      for (let i = count; i < 24; i++) {
        timeHour.push(i >= 10 ? i + '' : '0' + i);
      }

      this.setData({
        time: [timeHour, timeMin]
      })
    } else {
      this.setData({
        time: [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], ['00', '30']]
      })
    }
  },

  timeColumnChange: function (e) {
    if (this.data.order.date === this.data.startDate && e.detail.column === 0 && e.detail.value === 0) {
      var myDate = new Date();
      var minutes = myDate.getMinutes();
      var timeHour = this.data.time[0]

      if (minutes > 30) {
        this.setData({
          time: [timeHour, ['00', '30']]
        })
      } else {
        this.setData({
          time: [timeHour, ['30']]
        })
      }
    } else {
      this.setData({
        time: [this.data.time[0], ['00', '30']]
      })
    }
  },

  textareaInput: function(e) {
    app.globalData.pageSimAppoint.msg = e.detail.value
    this.setData({
      order: app.globalData.pageSimAppoint
    })
  },

  // 选择图片
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 4 - that.data.files.length,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // console.log(res)
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
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  deleteImage: function(event) {
    let arr = this.data.files
    arr.splice(arr.indexOf(event.target.dataset.item), 1)
    this.setData({
      files: arr
    })
  },

  verify: function({currentTarget: {dataset: {type}}}) {
    if (!this.data.order.address.name) {
      wx.showToast({
        title: '服务地址不能为空！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.order.date == '') {
      wx.showToast({
        title: '服务日期不能为空！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.order.time == '') {
      wx.showToast({
        title: '服务时间不能为空！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this,
      files = this.data.files,
      fileNames = '',
      success = 0

    if (this.data.files.length) {
      uploadImage()
    } else {
      type === 'submit' ? this.submitOrder(fileNames) : this.addToShopCart(fileNames)
    }

    function uploadImage() {
      wx.showLoading({
        title: '上传第' + (success + 1) + '张图片中...'
      })
      wx.uploadFile({
        url: path.uploadFile(),
        filePath: files[success],
        name: 'orderImage' + (success + 1),
        formData: {
          'file_name': 'orderImage' + (success + 1),
          'token': wx.getStorageSync('token')
        },
        success: function(res) {
          // console.log(res)
          if (JSON.parse(res.data).status) {
            fileNames = fileNames + JSON.parse(res.data).data.img_src + ','
            success += 1
            if (success < files.length) {
              wx.hideLoading()
              uploadImage()
            } else {
              wx.hideLoading()
              wx.showLoading({
                title: type === 'submit' ? '正在提交订单...' : '添加到购物车'
              })
              type === 'submit' ? that.submitOrder(fileNames) : that.addToShopCart(fileNames)
            }
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '图片上传错误。',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (err) {
          wx.showModal({
            title: '错误',
            content: path.uploadFile() + JSON.stringify(err)
          })
          wx.hideLoading()
          wx.showToast({
            title: '图片上传失败！',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  addToShopCart: function (fileNames) {
    var that = this
    var post_data = {
      p_id: this.data.product.p_id,
      remark: this.data.order.msg,
      address_id: this.data.order.address.id,
      expected_quotation: parseFloat(this.data.expected),
      is_standard: 0,
      date: this.data.order.date,
      time: this.data.order.time,
      labels: JSON.stringify(that.getSelectedLabel()),
      take_address_id: this.data.order.startAddr ? this.data.order.startAddr.id : null,
      file_name: fileNames.substring(0, fileNames.length - 1)
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

  submitOrder: function (fileNames) {
    var that = this
    var submitOrder = wxRequest.postRequest(path.submitOrder(), {
      obj_name: that.data.product.p_name,
      obj_id: that.data.product.p_id,
      c_id: that.data.product.c_id,
      make_time: that.data.order.date + ' ' + that.data.order.time,
      remark: that.data.order.msg,
      mobile: that.data.order.address.mobile,
      username: that.data.order.address.name,
      address_info: JSON.stringify(that.data.order.address),
      order_type: 1,
      expected_quotation: that.data.expected,
      labels: JSON.stringify(that.getSelectedLabel()),
      file_name: fileNames.substring(0, fileNames.length - 1)
    });
    submitOrder.then(result => {
      if (result.data.status) {
        wx.hideLoading()
        wx.reLaunch({
          url: '/pages/orders/index'
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

  fourthCheck: function ({ currentTarget: { dataset: { index } } }) {
    let product = this.data.product
    product.labels[index].checked = !product.labels[index].checked

    this.setData({
      product
    })
  },

  fifthTap: function ({ currentTarget: { dataset: { index, idx } } }) {
    let product = this.data.product
    if (!product.labels[index].child_labels[idx].checked) {
      product.labels[index].checked = true
    }
    product.labels[index].child_labels[idx].checked = !product.labels[index].child_labels[idx].checked

    this.setData({
      product
    })
  },

  getSelectedLabel: function () {
    let splList = []
    this.data.product.labels.map(item => {
      let child_labels = []
      item.child_labels.map(label => {
        if (label.checked) {
          child_labels.push(label)
        }
      })
      item.child_labels = child_labels
      if (item.checked || item.child_labels.length) {
        splList.push(item)
      }
    })

    return splList
  },
})