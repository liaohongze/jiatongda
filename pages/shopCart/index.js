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
    current: 'tab1',
    isLoading: true,
    currentPage1: 1,
    totalPage1: 1,
    currentPage2: 1,
    totalPage2: 1,
    showNoMore: false,
    allChecked: false,
    allPrice: 0,
    startDate: '', //用于时间选择器的开始时间
    endDate: '', //用于时间选择器的结束时间
    index: [0, 0],
    time: [['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'], ['00', '30']],
    couponMsg: '未使用优惠券',
    list1: [
      {
        c_id: 1,
        c_name: "家电安装",
        date: '2018-05-28',
        time: '09:00',
        endAddr: {
          name: '张三',
          mobile: '18559782829',
          address: '厦门集美区软件园三期A区02栋5楼501室'
        },
        product_list: [
          {
            p_id: 1,
            p_name: "电视安装(挂装)",
            sku_list: [
              {
                product_type: '不含挂架',
                product_guige: '32寸以下',
                sale_price: 62,
                num: 1
              },
              {
                product_type: '含挂架',
                product_guige: '32-49寸',
                sale_price: 120,
                num: 2
              }
            ]
          },
          {
            p_id: 2,
            p_name: "洗衣机安装",
            sku_list: [
              {
                product_type: '安装',
                product_guige: '波轮洗衣机',
                sale_price: 40,
                num: 1
              }
            ]
          }
        ]
      },
      {
        c_id: 5,
        c_name: "家具安装",
        date: '2018-05-28',
        time: '09:00',
        endAddr: {
          name: '张三',
          mobile: '18559782829',
          address: '厦门集美区软件园三期A区02栋5楼501室'
        },
        product_list: [
          {
            p_id: 4,
            p_name: "床具安装",
            sku_list: [
              {
                product_type: '安装',
                product_guige: '实木床',
                sale_price: 110,
                num: 1
              },
              {
                product_type: '安装',
                product_guige: '高低子母床',
                sale_price: 220,
                num: 2
              }
            ]
          },
          {
            p_id: 8,
            p_name: "椅子",
            sku_list: [
              {
                product_type: '安装',
                product_guige: '一张',
                sale_price: 40,
                num: 1
              }
            ]
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    let list1 = this.data.list1
    if (app.globalData.pageShopCart.coupon.index) {
      list1[app.globalData.pageShopCart.index].coupon = app.globalData.pageShopCart.coupon
    }

    this.setData({
      list1
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  tabsChange({detail}) {
    this.setData({
      current: detail.key
    });
  },

  getShopCart: async function () {
    var cartList = await wxRequest.postRequest(path.getShopCart(), {
      page: this.data.currentPage1,
      page_size: 10,
      is_standard: 1
    });

    // console.log(cartList)
  },

  categoryChange(e) {
    this.setData({
      allChecked: e.detail.value.length === this.data.list1.length
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
    })
  },

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

  getFinalTotal: function () {
    let total = this.getTotal()
    let list1 = this.data.list1
    let couponTotal = 0
    // list1.map(cate => {
    //   cate.product_list.map(prod => {
    //     prod.sku_list.map(sku => {
    //       if (sku.checked) {
    //         total += parseFloat(sku.sale_price) * sku.num
    //       }
    //     })
    //   })
    // })

    return (total - couponTotal).toFixed(2)
  },

  takeOrder: function () {
    console.log(this.getTotal())
  },

  // 选择地址
  selectAddr: function ({ currentTarget: { dataset: { index, cid, addrtype } } }) {
    let list1 = this.data.list1
    let ids = ''
    list1[index].product_list.map(item => {
      ids += item.p_id + ','
    })
    ids = ids.substring(0, ids.length -1)
    wx.navigateTo({
      url: '/pages/address/index?from=shopCart&idx=' + index + '&addrtype=' + addrtype + '&id=' + ids,
    })
  },

  // 计数器
  reduce: function ({ currentTarget: { dataset: { index, prodindex, skuindex } } }) {
    let list1 = this.data.list1
    let num = list1[index].product_list[prodindex].sku_list[skuindex].num
    if (num > 1) {
      list1[index].product_list[prodindex].sku_list[skuindex].num = num - 1
    }

    this.setData({
      list1
    })
  },

  plus: function ({ currentTarget: { dataset: { index, prodindex, skuindex } } }) {
    let list1 = this.data.list1
    list1[index].product_list[prodindex].sku_list[skuindex].num += 1

    this.setData({
      list1
    })
  },

  numChange: function ({ currentTarget: { dataset: { index, prodindex, skuindex } }, detail: { value } }) {
    let list1 = this.data.list1
    list1[index].product_list[prodindex].sku_list[skuindex].num = value

    this.setData({
      list1
    })
  },

  //选择日期
  bindDateChange: function ({ currentTarget: { dataset: { index } }, detail: { value } }) {
    let list1 = this.data.list1
    list1[index].date = value
    this.setData({
      list1
    })
  },

  //选择时间
  bindTimeChange: function ({ currentTarget: { dataset: { index } }, detail: { value } }) {
    let list1 = this.data.list1
    list1[index].time = this.data.time[0][value[0]] + ':' + this.data.time[1][value[1]]
    this.setData({
      list1
    })
  },

  clickTimePicker: function ({ currentTarget: { dataset: { index } } }) {
    if (this.data.list1[index].date === '') {
      wx.showToast({
        title: '请先选择日期！',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    if (this.data.list1[index].date === this.data.startDate) {
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
    if (this.data.list1[index].date === this.data.startDate && column === 0 && value === 0) {
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
    var url = '../serviceCoupon/index?c_id=' + cid + '&total=' + this.getCategoryTotal(index) + '&index=' + index + '&from=shopCart'
    wx.navigateTo({
      url: url,
    })
  }
})