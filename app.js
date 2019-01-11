//app.js
var path = require('./utils/api.js');

var wxRequest = require('./utils/wxRequest.js')
// 引入SDK核心类
var QQMapWX = require('./utils/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var map = new QQMapWX({
  key: 'LFJBZ-KAUCO-N4XWA-S535O-7F3D5-OWFKP' // 必填
});
App({
  globalData: {
    isRegister: false,
    userInfo: "",
    userId: '',
    js_code: "",
    openid: "",
    session_key: "",
    payCount: 0,
    address: {
      province: '',
      city: '',
      area: '',
      allAddr: '',
      location: {},
      street_number: '',
      selectCity: '',
      selectAdcode: '',
      adcode: ''
    },
    serviceTel: '',
    pageCards: {},
    pageLocation: {},
    pageAddress: {},
    pageAppointment: {
      productId: '',
      typeData: [],
      specData: [],
      count: 1,
      startAddr: '',
      endAddr: '',
      date: '',
      time: '',
      msg: ''
    },
    pageSimAppoint: {
      productId: '',
      address: {},
      date: '',
      time: '',
      msg: ''
    },
    pagePay: {
      coupon: {
        code: '',
        prices: 0
      }
    },
    orderType: '', //由于switchtab不能带参数，跳转之前先设定该参数，跳转之后从这里取参
    editAddr: {},
    shopCart: []
  },
  onLaunch: function () {
     // 展示本地存储能力
     var logs = wx.getStorageSync('logs') || []
     logs.unshift(Date.now())
     wx.setStorageSync('logs', logs);
  },
  auth_return:function(){
    return;
  },

  // 获取客服电话
  getServiceTel: function () {
    var that = this
    var systel = wxRequest.postRequest(path.systel());
    systel.then(res => {
      if (res.data.status) {
        that.globalData.serviceTel = res.data.data.value
      }
    })
  },

  // 定位
  getLoaction: function (cb) {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        map.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            // console.log(res)
            that.globalData.address.allAddr = res.result.address
            that.globalData.address.province = res.result.address_component.province
            that.globalData.address.city = res.result.address_component.city
            that.globalData.address.area = res.result.address_component.district
            that.globalData.address.street_number = res.result.address_component.street_number
            that.globalData.address.location = res.result.ad_info.location
            that.globalData.address.adcode = res.result.ad_info.adcode
            cb ? cb() : null
          },
          fail: function (res) {
            console.log(res);
          }
          // complete: function (res) {
          //   console.log(res);
          // }
        });
      }
    })
  }
})
