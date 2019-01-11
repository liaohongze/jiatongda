// pages/shopCart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
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
        p_list: [
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

  tabsChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  categoryChange(e) {
    console.log('category发生change事件，携带value值为：', e.detail.value)
    var list = this.data.list
    e.detail.value.map(item => {
      if (this.data.cIds.indexOf(item) !== -1) {
        var products = list[this.data.cIds.indexOf(item)].product_list
        products.map(prod => {
          prod.checked = true

          prod.sku_list.map(sku => {
            sku.checked = true
          })
        })
      }
    })

    this.setData({
      list: list
    })
  },

  productChange(e) {
    console.log('product发生change事件，携带value值为：', e.detail.value)
  },

  skuChange(e) {
    console.log('sku发生change事件，携带value值为：', e.detail.value)
    var list = this.data.list
    var skuIndexs = []
    e.detail.value.map(item => {
      skuIndexs.push(item.split(',')[2])
    })
    // 获取产品类型和产品
    if (e.detail.value.length) { //如果点击选择有选中
      var firstProd = e.detail.value[0].split(',')
      var cid = firstProd[0]
      var pid = firstProd[1]
      var products = list[this.data.cIds.indexOf(cid)].product_list
      products.map(prod => {
        if(prod.p_id === pid) {
          prod.sku_list.map((sku, skuIndex) => {
            sku.checked = false
            if (skuIndexs.indexOf(skuIndex) !== -1) {
              sku.checked = true
            }
          })

          // 如果选中项的长度等于该产品下的sku（实际产品）的长度，即为全部选中，将产品选中
          if (e.detail.value.length === prod.sku_list.length) {
            prod.checked = true
          } else {
            prod.checked = false
            list[this.data.cIds.indexOf(cid)].checked = false
          }
        }
      })

      var allProdCheck = true
      products.map(secondProd => {
        secondProd.checked ? null : allProdCheck = false
      })
      allProdCheck ? list[this.data.cIds.indexOf(cid)].checked = true : null
    }

    this.setData({
      list: list
    })
  }
})