// pages/selectCity/index.js
var app = getApp()
var city = require('../../utils/city.js');
var path = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    selectCity: '',
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    tHeight: 0,
    bHeight: 0,
    startPageY: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,
    itemH: 0,
    searchStatus: false,
    result: [],
    isLoading: true,
    currentPage: 1,
    totalPage: 1,
    showNoMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 所有城市列表 开始 //
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    // console.log(cityList);

    var sysInfo = wx.getSystemInfoSync();
    // console.log(sysInfo);
    var winHeight = sysInfo.windowHeight - 170;

    //添加要匹配的字母范围值
    //1、更加屏幕高度设置子元素的高度
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;

      tempObj.push(temp)
    }

    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })
    // 所有城市列表 结束 //
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
    var addr = app.globalData.address
    this.setData({
      city: addr.city,
      selectCity: addr.selectCity == '' ? addr.city : addr.selectCity //如果一开始还未选择城市，那么选择的城市和当前城市一样
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

  setSearchValue: function (e) {
    var that = this
    //搜索城市接口
    var searchCity = wxRequest.postRequest(path.searchCity(), {
      page: that.data.currentPage,
      pagesize: 30,
      search_text: e.detail.value
    });
    searchCity.then(res => {
      if (res.data.status) {
        that.setData({
          result: res.data.data.list
        })
      }
    })
  },

  // 搜索栏聚焦
  searchFocus: function () {
    this.setData({
      searchStatus: true
    })
  },

  // 搜索栏失去焦点
  searchBlur: function () {
    this.setData({
      searchStatus: false
    })
  },

  getLoaction: function() {
    var that = this
    that.setData({
      city: '重新定位中...'
    })
    app.getLoaction(function() {
      that.setData({
        city: app.globalData.address.city
      })
    })
  },

  // 所有城市列表 方法开始 //
  searchStart: function (e) {
    var showLetter = e.currentTarget.dataset.letter;
    var pageY = e.touches[0].pageY - 170;
    this.setScrollTop(this, showLetter);
    this.nowLetter(pageY, this);
    this.setData({
      showLetter: showLetter,
      startPageY: pageY,
      isShowLetter: true,
    })
  },
  searchMove: function (e) {
    var pageY = e.touches[0].pageY - 170;
    var startPageY = this.data.startPageY;
    var tHeight = this.data.tHeight;
    var bHeight = this.data.bHeight;
    var showLetter = 0;
    // console.log(pageY);
    if (startPageY - pageY > 0) { //向上移动
      if (pageY < tHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    } else {//向下移动
      if (pageY > bHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    }
  },
  searchEnd: function (e) {
    // console.log(e);
    // var showLetter=e.currentTarget.dataset.letter;
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)

  },
  nowLetter: function (pageY, that) {//当前选中的信息
    var letterData = this.data.searchLetter;
    var bHeight = 0;
    var tHeight = 0;
    var showLetter = "";
    for (var i = 0; i < letterData.length; i++) {
      if (letterData[i].tHeight <= pageY && pageY <= letterData[i].bHeight) {
        bHeight = letterData[i].bHeight;
        tHeight = letterData[i].tHeight;
        showLetter = letterData[i].name;
        break;
      }
    }

    this.setScrollTop(that, showLetter);

    that.setData({
      bHeight: bHeight,
      tHeight: tHeight,
      showLetter: showLetter,
      startPageY: pageY
    })
  },
  bindScroll: function (e) {
    // console.log(e.detail)
  },
  setScrollTop: function (that, showLetter) {
    var scrollTop = 0;
    var cityList = that.data.cityList;
    var cityCount = 0;
    var initialCount = 0;
    for (var i = 0; i < cityList.length; i++) {
      if (showLetter == cityList[i].initial) {
        scrollTop = initialCount * 30 + cityCount * 41;
        break;
      } else {
        initialCount++;
        cityCount += cityList[i].cityInfo.length;
      }
    }

    that.setData({
      scrollTop: scrollTop
    })
  },
  // 点击选择城市
  bindCity: function (e) {
    var selectCity = e.currentTarget.dataset;
    app.globalData.address.selectCity = selectCity.city
    app.globalData.address.selectAdcode = selectCity.adcode
    this.setData({ selectCity: selectCity }, () => { wx.navigateBack() })
  },
  // 所有城市列表 方法结束 //

  selectCurrentCity: function () {
    app.globalData.address.selectCity = ''
    app.globalData.address.selectAdcode = ''
    wx.navigateBack()
  }
})