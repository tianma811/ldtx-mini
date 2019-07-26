// pages/user/phone/phone.js

var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    validcode: '',
    isSend:false,
    remainSeconds: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  },

  sendvalid: function (e) {
    let self = this;
    if (this.data.mobile == "") {
      util.showErrorModal("手机号码不能为空");
      return;
    }
    util.request(app.data.apiurl + '/wechat/sendSMSCaptcha', {
      mobile: self.data.mobile,
      openid: app.data.logininfo.openid
    }, function (res) {
      util.showErrorModal("验证码发送成功");
      self.setData({
        isSend: true,
        remainSeconds: 60
      });
      let t = setInterval(function () {
        self.setData({
          remainSeconds: --self.data.remainSeconds
        });
      }, 1000);
      setTimeout(function () {
        self.setData({
          isSend: false
        });
        clearInterval(t);
      }, 60000);

    });
  },

  mobile: function (e) {
    this.data.mobile = e.detail.value;
  },
  validcode: function (e) {
    this.data.validcode = e.detail.value;
  },

  bindTelephone:function(e){
    let self = this; 
    if (this.data.mobile == "") {
      util.showErrorModal("手机号码不能为空");
      return;
    }
    if (this.data.validcode == "") {
      util.showErrorModal("验证码不能为空");
      return;
    }

    util.request(app.data.apiurl + '/wechat/bindMobile', {
      mobile: self.data.mobile,
      captcha: self.data.validcode,
      agentId: app.data.agentId,
      openid: app.data.logininfo.openid,
      formid: e.detail.formId
    }, function (res) {
      if(res.status > 0){
        wx.setStorageSync(app.data.logininfokey, res.data);
        app.data.logininfo = res.data;
        wx.switchTab({
          url: '/pages/index/index',
        })
      }else{
        util.showErrorModal(res.data.message);
      }
    })
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

  }
})