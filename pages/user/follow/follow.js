var util = require('../../..//utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepList: ["跟进信息", "成交信息"],
    orderAttr: 0,
    dormitoryId: '',
    followUpList: [],
    dealList: [],
    logininfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      logininfo: app.data.logininfo
    })
    if (options.dormitoryId){
      this.data.dormitoryId = options.dormitoryId;
    }
  },

  onShow: function(){
    let self = this;
    util.request(app.data.apiurl + "/dormitory/getFollowUp", {
      dormitoryId: self.data.dormitoryId,
      openid: app.data.logininfo.openid,
    }, function (r) {
      if (r.status > 0) {
        
        self.setData({
          followUpList: r.data.filter(d => { return d.deal == '0' }),
          dealList: r.data.filter(d => { return d.deal == '1' }),
        });
      } 
    });
  },

  tabClick: function(e){
    this.setData({
      orderAttr: e.target.dataset.index
    })
  },
  addFollowUp: function(){
    wx.navigateTo({
      url: '/pages/user/follow_add/follow_add?dormitoryId=' + this.data.dormitoryId,
    });
  }
})