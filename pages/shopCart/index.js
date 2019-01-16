// pages/shopCart/index.js
import regeneratorRuntime from '../../utils/runtime.js'
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '1',
    isLoading: true,
    currentPage1: 1,
    currentPage2: 1,
    totalPage1: 1,
    totalPage2: 1,
    showNoMore: false,
    allChecked: false,
    allChecked2: false,
    finalTotal: 0,
    startDate: '', //用于时间选择器的开始时间
    endDate: '', //用于时间选择器的结束时间
    index: [0, 0],
    time: [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], ['00', '30']],
    couponMsg: '未使用优惠券',
    list1: [],
    list2: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.tab) {
      this.getShopcartList(options.tab)
      this.setData({
        current: options.tab
      })
    } else {
      this.getShopcartList('1')
    }
    //设定日期，开始日期为当前日期，为期一年
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();

    if (month < 10) {
      month = '0' + month
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
    let list = this.data['list' + this.data.current]
    if (app.globalData.pageShopCart.coupon.index) {
      list[app.globalData.pageShopCart.coupon.index].coupon_info = app.globalData.pageShopCart.coupon
    }

    if (app.globalData.pageShopCart.address.idx) {
      if (app.globalData.pageShopCart.address.addrtype === 'start') {
        list[app.globalData.pageShopCart.address.index].take_address_info = app.globalData.pageShopCart.address.addr
      } else if (app.globalData.pageShopCart.address.addrtype === 'end') {
        list[app.globalData.pageShopCart.address.index].address_info = app.globalData.pageShopCart.address.addr
      }
    }

    this.setData({
      ['list' + this.data.current]: list
    })
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
    if (this.data['currentPage' + this.data.current] <= this.data['totalPage' + this.data.current]) {
      this.getShopcartList(this.data.current)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  tabsChange({detail}) {
    if (this.data.isLoading) return

    if (this.data['currentPage' + detail.key] === 1) {
      this.getShopcartList(detail.key)
    }

    this.setData({
      current: detail.key
    });
  },

  getShopcartList: async function (tab) {
    var list = await wxRequest.postRequest(path.getShopCart(), {
      page: this.data['currentPage' + tab],
      page_size: 10,
      is_standard: tab === '1' ? 1 : 0
    });

    if (list.data.status) {
      this.setData({
        ['list' + tab]: [...this.data['list' + tab], ...list.data.data.list],
        ['totalPage' + tab]: Math.ceil(list.data.data.count / 10),
        ['currentPage' + tab]: this.data['currentPage' + tab] + 1,
        isLoading: false,
        showNoMore: (this.data['currentPage' + tab] + 1) > Math.ceil(list.data.data.count / 10) ? true : false
      })
    }
  },

  categoryChange(e) {
    this.setData({
      allChecked: e.detail.value.length === this.data.list1.length
    }, () => {
      this.getFinalTotal()
    })
  },

  categoryChange2(e) {
    this.setData({
      allChecked2: e.detail.value.length === this.data.list2.length
    })
  },

  productChange(e) {
    if (!e.detail.value.length) return
    var list1 = this.data.list1
    var categoryIndex = e.detail.value[0].split(',')[0] // 选中的产品的所属二级分类的索引
    list1[categoryIndex].checked = (list1[categoryIndex].product_list.length === e.detail.value.length)

    if (list1[categoryIndex].checked) {
      let allCateCheck = true
      list1.map(item => {
        item.checked ? null : allCateCheck = false
      })

      if (allCateCheck) {
        this.setData({
          allChecked: true
        })
      }
    }
    this.setData({
      list1
    }, () => {
      this.getFinalTotal()
    })
  },

  productChange2(e) {
    if (!e.detail.value.length) return
    var list2 = this.data.list2
    var categoryIndex = e.detail.value[0].split(',')[0] // 选中的产品的所属二级分类的索引
    list2[categoryIndex].checked = (list2[categoryIndex].product_list.length === e.detail.value.length)

    if (list2[categoryIndex].checked) {
      let allCateCheck = true
      list2.map(item => {
        item.checked ? null : allCateCheck = false
      })

      if (allCateCheck) {
        this.setData({
          allChecked2: true
        })
      }
    }
    this.setData({
      list2
    })
  },

  skuChange(e) {
    if (!e.detail.value.length) return
    var list1 = this.data.list1
    var arr = e.detail.value[0].split(',')
    var categoryIndex = arr[0] // 选中的产品的所属二级分类的索引
    var prodIndex = arr[1] // 选中的sku所属的产品的索引
    list1[categoryIndex].product_list[prodIndex].checked = (list1[categoryIndex].product_list[prodIndex].sku_list.length === e.detail.value.length)

    if (list1[categoryIndex].product_list[prodIndex].checked) {
      let allProdCheck = true
      list1[categoryIndex].product_list.map(item => {
        item.checked ? null : allProdCheck = false
      })

      if (allProdCheck) {
        list1[categoryIndex].checked = true

        let allCateCheck = true
        list1.map(item => {
          item.checked ? null : allCateCheck = false
        })

        if (allCateCheck) {
          this.setData({
            allChecked: true
          })
        }
      }
    }
    this.setData({
      list1
    }, () => {
      this.getFinalTotal()
    })
  },

  cateTap: function({currentTarget: {dataset: {index}}}) {
    //checked为上一次的状态，
    //如果checked为true，即这次去掉勾选，把该一级及所有的子集都置为false
    //如果checked为false，即这次勾选上，把该一级及所有的子集都置为true
    var list1 = this.data.list1
    if (list1[index].checked) {
      list1[index].checked = false
      list1[index].product_list.map(item => {
        item.checked = false
        item.sku_list.map(skuItem => {
          skuItem.checked = false
        })
      })
    } else {
      list1[index].checked = true
      list1[index].product_list.map(item => {
        item.checked = true
        item.sku_list.map(skuItem => {
          skuItem.checked = true
        })
      })
    }

    this.setData({
      list1
    }, () => {
      this.getFinalTotal()
    })
  },

  cateTap2: function({currentTarget: {dataset: {index}}}) {
    //checked为上一次的状态，
    //如果checked为true，即这次去掉勾选，把该一级及所有的子集都置为false
    //如果checked为false，即这次勾选上，把该一级及所有的子集都置为true
    var list2 = this.data.list2
    if (list2[index].checked) {
      list2[index].checked = false
      list2[index].product_list.map(item => {
        item.checked = false
      })
    } else {
      list2[index].checked = true
      list2[index].product_list.map(item => {
        item.checked = true
      })
    }

    this.setData({
      list2
    })
  },

  prodTap: function ({ currentTarget: { dataset: { index, prodindex } } }) {
    var list1 = this.data.list1
    var allChecked = this.data.allChecked
    if (list1[index].product_list[prodindex].checked) {
      allChecked = false
      list1[index].product_list[prodindex].checked = false
      list1[index].product_list[prodindex].sku_list.map(item => {
        item.checked = false
      })
    } else {
      list1[index].product_list[prodindex].checked = true
      list1[index].product_list[prodindex].sku_list.map(item => {
        item.checked = true
      })
    }

    this.setData({
      list1,
      allChecked
    }, () => {
      this.getFinalTotal()
    })
  },

  prodTap2: function ({ currentTarget: { dataset: { index, prodindex } } }) {
    var list2 = this.data.list2
    var allChecked2 = this.data.allChecked2
    if (list2[index].product_list[prodindex].checked) {
      allChecked2 = false
      list2[index].checked = false
      list2[index].product_list[prodindex].checked = false
    } else {
      list2[index].product_list[prodindex].checked = true
    }

    this.setData({
      list2,
      allChecked2
    })
  },

  skuTap: function ({ currentTarget: { dataset: { index, prodindex, skuindex } } }) {
    var list1 = this.data.list1
    var allChecked = this.data.allChecked
    if (list1[index].product_list[prodindex].sku_list[skuindex].checked) {
      allChecked = false
      list1[index].checked = false
      list1[index].product_list[prodindex].checked = false
      list1[index].product_list[prodindex].sku_list[skuindex].checked = false
    } else {
      list1[index].product_list[prodindex].sku_list[skuindex].checked = true
    }

    this.setData({
      list1,
      allChecked
    }, () => {
      this.getFinalTotal()
    })
  },

  checkAll: function () {
    let list1 = this.data.list1
    if (this.data.allChecked) {
      list1.map(cate => {
        cate.checked = false
        cate.product_list.map(prod => {
          prod.checked = false
          prod.sku_list.map(sku => {
            sku.checked = false
          })
        })
      })
    } else {
      list1.map(cate => {
        cate.checked = true
        cate.product_list.map(prod => {
          prod.checked = true
          prod.sku_list.map(sku => {
            sku.checked = true
          })
        })
      })
    }

    this.setData({
      list1,
      allChecked: !this.data.allChecked
    }, () => {
      this.getFinalTotal()
    })
  },

  checkAll2: function () {
    let list2 = this.data.list2
    if (this.data.allChecked2) {
      list2.map(cate => {
        cate.checked = false
        cate.product_list.map(prod => {
          prod.checked = false
        })
      })
    } else {
      list2.map(cate => {
        cate.checked = true
        cate.product_list.map(prod => {
          prod.checked = true
        })
      })
    }

    this.setData({
      list2,
      allChecked2: !this.data.allChecked2
    })
  },


  // 纯总价
  getTotal: function () {
    let list1 = this.data.list1
    let total = 0
    list1.map(cate => {
      cate.product_list.map(prod => {
        prod.sku_list.map(sku => {
          if (sku.checked) {
            total += parseFloat(sku.sale_price) * sku.num
          }
        })
      })
    })

    return total.toFixed(2)
  },

  // 某个二级分类总价格
  getCategoryTotal: function (index) {
    let list1 = this.data.list1
    let total = 0
    list1[index].product_list.map(prod => {
      prod.sku_list.map(sku => {
        if (sku.checked) {
          total += parseFloat(sku.sale_price) * sku.num
        }
      })
    })

    return total.toFixed(2)
  },

  // 获取应付金额
  getFinalTotal: function () {
    let total = this.getTotal()
    let list1 = this.data.list1
    let couponTotal = 0
    list1.map(cate => {
      if (cate.coupon_info) {
        couponTotal += cate.coupon_info.prices
      }
    })

    this.setData({
      finalTotal: (total - couponTotal).toFixed(2)
    })

    return (total - couponTotal).toFixed(2)
  },

  takeOrder: async function ({ currentTarget: { dataset: { type } } }) {
    let orderJson = type ? this.getNewList1() : this.getNewList2()
    console.log(orderJson)
    if (orderJson === false) return
    if (!orderJson.length) {
      wx.showToast({
        title: '您没有选择任何产品',
        icon: 'none',
        duration: 2500
      })
      return
    }
    var submitShopcart = await wxRequest.postRequest(path.submitShopcart(), {
      order_json: JSON.stringify(orderJson),
      is_standard: type
    });

    let that = this

    if (submitShopcart.data.status) {
      wx.showModal({
        title: '提示',
        content: '订单提交成功！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            if (submitShopcart.data.data.order_all_sn) {
              wx.redirectTo({
                url: '/pages/shopcartPay/index?sn=' + submitShopcart.data.data.order_all_sn + '&total=' + that.getFinalTotal()
              })
            } else {
              wx.reLaunch({
                url: '/pages/orders/index',
              })
            }
          }
        }
      })
    } else {
      wx.showToast({
        title: submitShopcart.data.message,
        icon: 'none',
        duration: 2500
      })
    }
  },

  // 选择地址
  selectAddr: function ({ currentTarget: { dataset: { index, cid, addrtype } } }) {
    app.globalData.pageShopCart.address = {
      idx: '',
      addrtype: '',
      addr: {},
    }
    let list = this.data['list' + this.data.current]
    let ids = ''
    list[index].product_list.map(item => {
      ids += item.p_id + ','
    })
    ids = ids.substring(0, ids.length -1)
    wx.navigateTo({
      url: '/pages/address/index?from=shopCart&idx=' + index + '&addrtype=' + addrtype + '&id=' + ids,
    })
  },

  // 计数器
  reduce: function ({ currentTarget: { dataset: { index, prodindex, skuindex } } }) {
    let list = this.data['list' + this.data.current]
    let num
    if (this.data.current === '1') {
      num = list[index].product_list[prodindex].sku_list[skuindex].num
    } else {
      num = list[index].product_list[prodindex].num
    }
    if (num > 1) {
      if (this.data.current === '1') {
        list[index].product_list[prodindex].sku_list[skuindex].num = num - 1
      } else {
        list[index].product_list[prodindex].num = num - 1
      }
    }

    this.setData({
      ['list' + this.data.current]: list
    }, () => {
      if (this.data.current === '1') { this.getFinalTotal() }
    })
  },

  plus: function ({ currentTarget: { dataset: { index, prodindex, skuindex } } }) {
    let list = this.data['list' + this.data.current]
    if (this.data.current === '1') {
      list[index].product_list[prodindex].sku_list[skuindex].num += 1
    } else {
      list[index].product_list[prodindex].num += 1
    }

    this.setData({
      ['list' + this.data.current]: list
    }, () => {
      if (this.data.current === '1') { this.getFinalTotal() }
    })
  },

  numChange: function ({ currentTarget: { dataset: { index, prodindex, skuindex } }, detail: { value } }) {
    let list = this.data['list' + this.data.current]
    if (this.data.current === '1') {
      list[index].product_list[prodindex].sku_list[skuindex].num = value
    } else {
      list[index].product_list[prodindex].num = value
    }

    this.setData({
      ['list' + this.data.current]: list
    }, () => {
      if (value > 0 && this.data.current === '1') this.getFinalTotal()
    })
  },

  // 期望报价
  expectedChange: function ({ currentTarget: { dataset: { index, prodindex } }, detail: { value } }) {
    let list2 = this.data.list2
    list2[index].product_list[prodindex].expected_quotation = value

    this.setData({
      list2
    })
  },

  //选择日期
  bindDateChange: function ({ currentTarget: { dataset: { index } }, detail: { value } }) {
    let list = this.data['list' + this.data.current]
    list[index].date = value
    this.setData({
      ['list' + this.data.current]: list
    })
  },

  //选择时间
  bindTimeChange: function ({ currentTarget: { dataset: { index } }, detail: { value } }) {
    let list = this.data['list' + this.data.current]
    list[index].time = this.data.time[0][value[0]] + ':' + this.data.time[1][value[1]]
    this.setData({
      ['list' + this.data.current]: list
    })
  },

  clickTimePicker: function ({ currentTarget: { dataset: { index } } }) {
    if (this.data['list' + this.data.current][index].date === '') {
      wx.showToast({
        title: '请先选择日期！',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    if (this.data['list' + this.data.current][index].date === this.data.startDate) {
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

  timeColumnChange: function ({ currentTarget: { dataset: { index } }, detail: { column, value } }) {
    if (this.data['list' + this.data.current][index].date === this.data.startDate && column === 0 && value === 0) {
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

  // 选择优惠券
  selectCoupon: function ({ currentTarget: { dataset: { index, cid } } }) {
    app.globalData.pageShopCart.coupon = {
      index: '',
      coupon_code: '',
      coupon_id: '',
      prices: 0
    }
    var url = '../serviceCoupon/index?c_id=' + cid + '&total=' + this.getCategoryTotal(index) + '&index=' + index + '&from=shopCart'
    wx.navigateTo({
      url: url,
    })
  },

  // 重新组织的标准订单list
  getNewList1: function () {
    let list = this.data.list1
    let hasCateCheck = false
    let newList = []
    list.map(cate => {
      let hasProdCheck = false
      let newProdList = []
      cate.product_list.map(prod => {
        let newSkuList = []
        let hasSkuCheck = false
        prod.sku_list.map(sku => {
          if (sku.checked) {
            hasSkuCheck = true
            newSkuList.push(sku)
          }
        })

        if (hasSkuCheck) {
          prod.sku_list = newSkuList
          hasProdCheck = true
          newProdList.push(prod)
        }
      })

      if (hasProdCheck) {
        cate.product_list = newProdList
        hasCateCheck = true
        newList.push(cate)
      }
    })

    if (hasCateCheck) {
      let verify = true
      newList.map(item => {
        if (!item.address_info.username) {
          wx.showToast({
            title: '服务地址不能为空！',
            icon: 'none',
            duration: 2000
          })
          verify = false
          return false
        }
        if (item.date == '') {
          wx.showToast({
            title: '服务日期不能为空！',
            icon: 'none',
            duration: 2000
          })
          verify = false
          return false
        }
        if (item.time == '') {
          wx.showToast({
            title: '服务时间不能为空！',
            icon: 'none',
            duration: 2000
          })
          verify = false
          return false
        }
        item.is_standard = 1
        item.username = item.address_info.username
        item.mobile = item.address_info.mobile
      })

      return verify ? newList : false
    } else {
      return []
    }
  },

  getNewList2: function () {
    let list = this.data.list2
    let hasCateCheck = false
    let newList = []
    list.map(cate => {
      let hasProdCheck = false
      let newProdList = []
      let expected_quotation = 0
      cate.product_list.map(prod => {
        if (prod.checked) {
          hasProdCheck = true
          expected_quotation += prod.expected_quotation
          newProdList.push(prod)
        }
      })

      if (hasProdCheck) {
        cate.product_list = newProdList
        cate.expected_quotation = expected_quotation
        hasCateCheck = true
        newList.push(cate)
      }
    })

    if (hasCateCheck) {
      let verify = true
      newList.map(item => {
        if (!item.address_info.username) {
          wx.showToast({
            title: '服务地址不能为空！',
            icon: 'none',
            duration: 2000
          })
          verify = false
          return false
        }
        if (item.date == '') {
          wx.showToast({
            title: '服务日期不能为空！',
            icon: 'none',
            duration: 2000
          })
          verify = false
          return false
        }
        if (item.time == '') {
          wx.showToast({
            title: '服务时间不能为空！',
            icon: 'none',
            duration: 2000
          })
          verify = false
          return false
        }

        item.is_standard = 0
        item.username = item.address_info.username
        item.mobile = item.address_info.mobile
      })
      return verify ? newList : false
    } else {
      return []
    }
  },

  // 删除产品
  deleteProd: async function (e) {
    let dataset = e.currentTarget.dataset
    let post_data = {
      product_id: dataset.pid
    }

    if (dataset.skuid) {
      post_data.sku_id = dataset.skuid
    }
    let deleteShopcarProd = await wxRequest.postRequest(path.deleteShopcarProd(), post_data);
    if (deleteShopcarProd.data.status) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })

      this.setData({
        isLoading: true,
        currentPage1: 1,
        currentPage2: 1,
        totalPage1: 1,
        totalPage2: 1,
        showNoMore: false,
        allChecked: false,
        allChecked2: false,
        finalTotal: 0,
        startDate: '', //用于时间选择器的开始时间
        endDate: '', //用于时间选择器的结束时间
        index: [0, 0],
        time: [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], ['00', '30']],
        couponMsg: '未使用优惠券',
        list1: [],
        list2: []
      }, () => {
        this.getShopcartList(this.data.current)
      })
    }
  }
})