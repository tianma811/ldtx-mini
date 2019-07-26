var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.apiurl + "images/",
    isLogin: app.isLogin(),
    noPayCount: 0,
    noSendgoodCount: 0,
    noReceiveCount: 0,
    is_validated:0,
    user_card: "",
    logininfo: {},
    agent: {},
  },
  logout: function() {
    var logininfo = {};
    logininfo.user_id = "";
    logininfo.user_name = "";
    logininfo.user_rank = "";
    app.data.logininfo = {};
    this.setData({
      isLogin: false
    });
    wx.removeStorageSync(app.data.logininfokey);
    util.showErrorModal("注销成功", function() {
      wx.redirectTo({
        url: '/pages/user/login/login',
      })
    });
  },

  onLoad(options) {
    this.setData({
      logininfo: app.data.logininfo
    })
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    this.setData({
      isLogin: app.isLogin()
    });
    if(app.data.logininfo.userType=="1"){
      util.request(
        app.data.apiurl + '/wechat/getAgentInfo', {
          openid: app.data.logininfo.openid,
        },
        function (res) {
          if (res.status) {
            self.setData({
              agent: res.data
            })
          }
        }
      );
    }
    
  },
})