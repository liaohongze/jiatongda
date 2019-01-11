// pages/shopCart/index.js
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
import regeneratorRuntime from '../../utils/runtime.js'
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
    list1: [
      {
        c_id: 1,
        c_name: "家电安装",
        time: '2018-05-28 09:00',
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
                price: 62,
                count: 1
              },
              {
                product_type: '含挂架',
                product_guige: '32-49寸',
                price: 120,
                count: 2
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
                price: 40,
                count: 1
              }
            ]
          }
        ]
      },
      {
        c_id: 5,
        c_name: "家具安装",
        time: '2018-05-28 09:00',
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
                price: 110,
                count: 1
              },
              {
                product_type: '安装',
                product_guige: '高低子母床',
                price: 220,
                count: 2
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
                price: 40,
                count: 1
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
    // this.getShopCart()
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
  }
})