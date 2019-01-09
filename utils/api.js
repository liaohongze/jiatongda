import config from 'config.js'
var domain = config.getDomain;
var imgdomain = config.getImageDomain;
module.exports = {
  getDomain: function () {
    return domain
  },
  getImageDomain: function () {
    return imgdomain
  },
  //获取token
  getToken:function(){
    return domain + "/mini_user/index/login";
  },
  //获取电话号码的接口
  getWxPhone: function () {
    return domain + "/small_store/Assembly/getWxPhone";
  },
  //用户绑定微信手机[默认注册]
  wxRegister: function () {
    return domain + "/mini_user/wx_user/wx_register";
  },
  //测试
  test:function(){
    return domain + "/mini_user/index/test";
  },
  //首页轮播图
  getBanners: function() {
    return domain + "/mini_user/banner/get_banner";
  },
  //获取短信验证码
  getSmsCode: function() {
    return domain + "/mini_user/wx_user/sms_code";
  },
  //获取图形数字验证接口
  getCode: function () {
    return domain + "/mini_user/wx_user/img_code";
  },
  //推荐注册
  register: function () {
    return domain + "/mini_user/wx_user/register";
  },
  //获取一级分类
  selectServiceGroup: function () {
    return domain + "/mini_user/service/select_service_group";
  },
  //获取顶级服务类对应热门服务 或者 所有子服务
  selectServiceCategory: function () {
    return domain + "/mini_user/service/select_service_category";
  },
  //搜索某服务对应的产品，搜索第一个服务对应的产品，搜索所有产品
  selectServiceProduct: function () {
    return domain + "/mini_user/service/select_service_product";
  },
  // 查询热门标签
  hotSearch: function() {
    return domain + "/mini_user/service/select_label"
  },
  // 获取服务类下的某产品信息获取服务类下的某产品信息[规格类型等]
  getProduct: function () {
    return domain + "/mini_user/service/select_service_product_info"
  },
  //查询某服务类对应的子服务(产品)评论
  productComment: function () {
    return domain + "/mini_user/comment/product_Comment"
  },
  // 判断用户某产品是否收藏
  isCollect: function () {
    return domain + "/mini_user/service/is_no_colection"
  },
  // 添加收藏
  addCollect: function () {
    return domain + "/mini_user/collection/add_colection"
  },
  // 删除收藏
  delectCollect: function () {
    return domain + "/mini_user/collection/delect_coleciton"
  },
  // 获取客服电话
  systel: function () {
    return domain + "/mini_user/system/systel"
  },
  // 添加浏览次数
  addSeeTimes: function () {
    return domain + "/mini_user/service/add_see_times"
  },
  // 查询用户信息
  userinfo: function () {
    return domain + "/mini_user/wx_user/select_userinfo"
  },
  // 交易流水 个人财务记录表
  traceLog: function () {
    return domain + "/mini_user/finance/select_my_finance"
  },
  // 获取用户银行卡列表
  userBankList: function () {
    return domain + "/mini_user/cash/get_user_bank_list"
  },
  // 查询个人优惠券
  getCoupon: function () {
    return domain + "/mini_user/coupon/selct_coupon"
  },
  // 查询收藏
  getCollection: function () {
    return domain + "/mini_user/collection/select_colection"
  },
  // 获取通用银行卡列表
  getBankList: function () {
    return domain + "/mini_user/cash/get_bank_list"
  },
  // 添加银行卡
  addBank: function () {
    return domain + "/mini_user/cash/add_bank_info"
  },
  // 客户端提现
  getCash: function () {
    return domain + "/mini_user/cash/add_user_cash"
  },
  // 客户端检索对应产品可以使用的地址
  addressList: function () {
    return domain + "/mini_user/address/order_address_list"
  },
  // 删除某条地址
  deleteAddr: function () {
    return domain + "/mini_user/address/delect_address"
  },
  // 新增用户地址or更新用户地址
  addAddr: function () {
    return domain + "/mini_user/address/new_address"
  },
  // 获取产品的sku
  getProductSku: function () {
    return domain + "/mini_user/service/get_product_sku"
  },
  // 用户下单
  submitOrder: function () {
    return domain + "/mini_user/order/submit_order"
  },
  // 上传图片
  uploadFile: function () {
    return domain + "/mini_user/wx_user/file_up"
  },
  // 查询该用户所有订单或者某个状态的订单
  getOrders: function () {
    return domain + "/mini_user/order/select_order"
  },
  // 获取formid插入数据库
  getFormId: function () {
    return domain + "/mini_user/wxform/get_form_id"
  },
  // 根据订单id查询订单详情
  getOrder: function () {
    return domain + "/mini_user/order/get_order_info"
  },
  // 根据订单查询评论
  getOrderComment: function () {
    return domain + "/mini_user/comment/get_order_comment"
  },
  // 小程序微信支付获取支付密钥
  getWxpay: function () {
    return domain + "/mini_user/user_pay/standards_get_wxpay"
  },
  // 用户添加评论
  addComment: function () {
    return domain + "/mini_user/comment/add_comment"
  },
  // 添加感谢费or添加差价
  payFee: function () {
    return domain + "/mini_user/user_pay/add_else_fee"
  },
  // 取消订单
  cancelOrder: function () {
    return domain + "/mini_user/order/cancel_order"
  },
  // 订单状态更改为已完成
  sureOrder: function () {
    return domain + "/mini_user/order/sure_order"
  },
  // 搜索产品
  searchProduct: function () {
    return domain + "/mini_user/search/search_product"
  },
  // 查询上门费
  doorFee: function () {
    return domain + "/mini_user/order/select_door_fee"
  },
  // 根据优惠券码兑换优惠券
  exchangeCoupon: function () {
    return domain + "/mini_user/coupon/get_coupon"
  },
  // 用户在报价成功后。支付时-取消支付的时候调用该接口
  cancelPay: function () {
    return domain + "/mini_user/order/cancel_pay"
  },
  // 搜索城市接口
  searchCity: function () {
    return domain + "/mini_user/address/search_city"
  },
  // 查询提现提示信息
  getWithdrawTip: function () {
    return domain + "/mini_user/cash/get_cash_config"
  },
  // 已报价师傅列表
  getMasters: function () {
    return domain + "/mini_user/order/getMasterList"
  },
  // 确认雇佣师傅
  sureOrderOffer: function () {
    return domain + "/mini_user/order/sureOrderOffer"
  },
  // 个人中心申请推广码
  generalizationCode: function () {
    return domain + "/mini_user/wx_user/generalizationCode"
  },
  // 推广明细
  getPromotionList: function () {
    return domain + "/mini_user/wx_user/getPromotionList"
  }
}