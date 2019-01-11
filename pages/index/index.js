// pages/home/index.js
var app = getApp()
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
import config from '../../utils/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*前端获取用户信息基础配置*/
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgDomain: path.getImageDomain(),
    auth_window_display: 'none',
    auth_phone_display: 'none',
    city: '',
    banner: [],
    menu: [],
    server: [],
    userId: '',
    token: '',
    recommender: null,
    registerType: 1,
    showGetCoupon: false,
    couponPrice: 0,
    showTabBar: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.userid) {
      this.setData({
        recommender: options.userid
      })
    }

    if (options.scene) {
      this.setData({
        recommender: options.scene,
        registerType: 2
      })
    }

    if (options.registerType === '2') {
      this.setData({
        registerType: parseInt(options.registerType)
      })
    }
    this.onLaunch();
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
    if (wx.getStorageSync('token')) {
      this.setData({
        city: app.globalData.address.selectCity == '' ? app.globalData.address.city : app.globalData.address.selectCity
      })

      // if (!app.globalData.isRegister) {
      //   this.get_token()
      // }
    }
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
    return {
      title: '家通达客户端',
      path: '/pages/index/index?userid=' + this.data.userId
    }
  },
  getPageData: function() {
    var that = this
    if (wx.getStorageSync('token')) {
      //首页轮播图
      var getPostsRequest = wxRequest.postRequest(path.getBanners());
      getPostsRequest.then(res => {
        if (res.data.status) {
          that.setData({
            banner: res.data.data.list
          })
        }
      })
      //获取顶级服务类对应热门服务 或者 所有子服务
      var selectServiceCategory = wxRequest.postRequest(path.selectServiceCategory(), {
        page: 1,
        num: 7,
        all: 1,
        is_recommend: 1
      });
      selectServiceCategory.then(res => {
        var list = res.data.data.list
        list.push({
          c_id: 8,
          c_name: "全部服务",
          g_id: 1,
          g_name: "安装",
          icon: "../../img/menu-icon-8.jpg",
          is_recommend: 1,
        })
        that.setData({
          menu: list
        })
      })
      //搜索某服务对应的产品，搜索第一个服务对应的产品，搜索所有产品
      var selectServiceProduct = wxRequest.postRequest(path.selectServiceProduct(), {
        page: 1,
        num: 3
        //,category_id: 1
      });
      selectServiceProduct.then(res => {
        if (res.data.status) {
          that.setData({
            server: res.data.data.data
          })
        }
      })

      // 定位
      app.getLoaction(function() {
        that.setData({
          city: app.globalData.address.city
        })
      })

      //一开始获取客服电话
      app.getServiceTel()
    }
  },
  clickBanner: function(e) {
    if (e.currentTarget.dataset.url.length < 10) return;
    var url

    if (e.currentTarget.dataset.url.substr(0, 7) === '/pages/') {
      const pageName = e.currentTarget.dataset.url.split('/')[2]
      const navPage = ['index', 'customized', 'orders', 'user']
      url = e.currentTarget.dataset.url

      if (navPage.includes(pageName)) {
        wx.reLaunch({
          url: url,
        });
      } else {
        wx.navigateTo({
          url: url
        })
      }
    } else {
      url = '/pages/article/index?url=' + e.currentTarget.dataset.url
      wx.navigateTo({
        url: url,
      });
    }
  },

  closeGetCoupon: function() {
    this.setData({
      showGetCoupon: false
    })
  },

  search: function(event) {
    wx.navigateTo({
      url: '/pages/search/index?keyword=' + event.detail.value,
    })
  },

  getCoupon: function () {
    var that = this
    var rightGet = wxRequest.postRequest(path.rightGet());
    rightGet.then(res => {
      if (res.data.status) {
        that.setData({
          showGetCoupon: false
        }, () => {
          wx.showToast({
            title: '领取成功',
            duration: 2500
          })
        })
      }
    })
  },

  // 获取优惠券总值信息
  couponNewInfo: function () {
    var that = this
    var couponNewInfo = wxRequest.postRequest(path.couponNewInfo(), {
      adcode: app.globalData.address.adcode
    });
    couponNewInfo.then(res => {
      if (res.data.status && res.data.data.get) {
        that.setData({
          couponPrice: res.data.data.price,
          showGetCoupon: true
        })
      }
    })
  },

  //点击去授权手机号,获取formid
  getFormId: function(e) {
    var that = this
    var getFormId = wxRequest.postRequest(path.getFormId(), {
      formid: e.detail.formId
    });
    getFormId.then(res => {

    })
  },

  onLaunch: function() {
    //全局
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res)
        //如果已经授权
        if (res.authSetting['scope.userInfo']) {
          that.get_token();
        } else {
          //如果未授权，弹出授权
          that.setData({
            auth_window_display: "flex"
          });
        }
      }
    });
  },
  onGotUserInfo: function(res) {
    // 可以将 res 发送给后台解码出 unionId
    if (res.detail.userInfo) {
      this.setData({
        auth_window_display: "none"
      })
      this.get_token();
    }
  },
  getPhoneNumber: function(e) {
    var that = this
    if (e.detail.encryptedData) {
      // 调用接口将encryptedData发送到后台解密出电话号码
      //搜索某服务对应的产品，搜索第一个服务对应的产品，搜索所有产品
      var getWxPhone = wxRequest.postRequest(path.getWxPhone(), {
        'type': 1,
        'encryptedData': e.detail.encryptedData,
        'iv': e.detail.iv
      });
      getWxPhone.then(res => {
        let registerObj = {
          'user_encode': that.data.recommender,
          'register_type': that.data.registerType
        }

        if (that.data.registerType === 1) {
          registerObj.wx_phone = res.data.data.purePhoneNumber
        } else if (that.data.registerType === 2) {
          registerObj.mobile = res.data.data.purePhoneNumber
        }

        if (res.data.status) { //从后台获取到手机号码
          var wxRegister = wxRequest.postRequest(path.wxRegister(), registerObj);

          wxRegister.then(result => {
            if (result.data.status) {
              app.globalData.isRegister = true
              app.globalData.userInfo.uid = result.data.data.uid
              that.couponNewInfo()
            } else {
              wx.showToast({
                title: result.data.message,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }

        that.setData({
          auth_phone_display: "none"
        })
      })
    } else {
      this.setData({
        auth_phone_display: "none"
      })
    }
  },
  get_token: function() {
    //全局
    var that = this;
    //先获取code
    wx.login({
      success: function(res) {
        // console.log('login',res)
        if (res.code) {
          that.code = res.code;
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log('getUserInfo',res)
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo;
              that.setData({
                userInfo: res.userInfo
              })
              wx.request({
                url: path.getToken(),
                data: {
                  code: that.code,
                  iv: res.iv,
                  encryptedData: res.encryptedData
                  // ,debug: 1
                },
                header: {
                  'content-type': 'application/json',
                  'app-ver': config.getVersion
                },
                success: function (tokenRes) {
                  if (tokenRes.data.code !== 200) {
                    wx.showModal({
                      title: '提示',
                      showCancel: false,
                      content: tokenRes.data.message,
                    })
                    return
                  }
                  wx.setStorageSync("token", tokenRes.data.data.token);
                  that.setData({
                    token: tokenRes.data.data.token
                  });

                  app.globalData.userId = tokenRes.data.data.uid
                  if (tokenRes.data.data.uid != '') {
                    that.setData({
                      userId: tokenRes.data.data.uid
                    })
                  }

                  if (tokenRes.data.data.role) {
                    var role = tokenRes.data.data.role.split(',')
                    //用户角色：1、师傅，2、客户，3、门店
                    if (role.indexOf('2') == -1) { // 如果该用户没有注册客户端，提示要绑定手机号
                      that.setData({
                        auth_phone_display: "flex"
                      });
                      app.globalData.isRegister = false
                    } else {
                      app.globalData.isRegister = true
                    }
                  } else {
                    that.setData({
                      auth_phone_display: "flex"
                    });
                    app.globalData.isRegister = false
                  }

                  that.setData({
                    showTabBar: true
                  });

                  that.getPageData()
                },
                fail: function(res) {
                  console.log(res)
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              /*
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              */
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  }
})