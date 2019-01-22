// pages/evaluate/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starIndex1: 0,
    starIndex2: 0,
    starIndex3: 0,
    order: {},
    msg: '',
    files: [],
    fileNames: '',
    isPublishing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderById(options.orderId)
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

  starChange1: function (e) {
    const index = e.detail.index;
    this.setData({
      'starIndex1': index
    })
  },

  starChange2: function (e) {
    const index = e.detail.index;
    this.setData({
      'starIndex2': index
    })
  },

  starChange3: function (e) {
    const index = e.detail.index;
    this.setData({
      'starIndex3': index
    })
  },
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
  previewImage: function (e) {
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

  textareaInput: function (e) {
    this.setData({
      msg: e.detail.value
    })
  },

  // 发布评论
  publish: function () {
    if (this.data.starIndex1 == 0) {
      wx.showToast({
        title: '您还没有评价专业技能',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.starIndex2 == 0) {
      wx.showToast({
        title: '您还没有评价服务态度',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.starIndex3 == 0) {
      wx.showToast({
        title: '您还没有评价服务时效',
        icon: 'none',
        duration: 2000
      })
      return
    }

    var that = this,
      files = this.data.files,
      fileNames = '',
      success = 0

    this.setData({
      isPublishing: true
    }, () => {
      if (this.data.files.length) { //如果有图片，先上传图片
        uploadImage()
      } else {
        that.addComment()
      }
    })

    function uploadImage() {
      wx.showLoading({
        title: '上传第' + (success + 1) + '张图片中...'
      })
      wx.uploadFile({
        url: path.uploadFile(),
        filePath: files[success],
        name: 'commentImage' + (success + 1),
        formData: {
          'file_name': 'commentImage' + (success + 1),
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res)
          if (JSON.parse(res.data).status) {
            fileNames = fileNames + JSON.parse(res.data).data.img_src + ','
            success += 1
            if (success < files.length) {
              wx.hideLoading()
              uploadImage()
            } else {
              wx.hideLoading()
              that.setData({
                fileNames: fileNames
              }, () => {
                that.addComment()
              })
            }
          }
        }
      })
    }
  },

  addComment: function () {
    var fileNames = this.data.fileNames
    var addComment = wxRequest.postRequest(path.addComment(), {
      to_uid: this.data.order.master_info.master_id,
      to_username: this.data.order.master_info.username,
      obj_id: this.data.order.order_id,
      star: '{"skill":' + this.data.starIndex1 + ',"attitude":' + this.data.starIndex2 + ',"efficiency":' + this.data.starIndex3 + '}',
      content: this.data.msg,
      file_name: fileNames.substring(0, fileNames.length - 1),
      product_id: this.data.order.obj_id //obj_id在数据里为产品id  
    });
    addComment.then(res => {
      // console.log(res)
      if (res.data.status) {
        wx.navigateBack()
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  getOrderById: function (id) {
    var that = this
    var getOrder = wxRequest.postRequest(path.getOrder(), {
      order_id: id
    });
    getOrder.then(res => {
      // var order = res.data.data
      // order.address_info = JSON.parse(order.address_info)
      if (res.data.status) {
        that.setData({
          order: res.data.data
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
  }
})