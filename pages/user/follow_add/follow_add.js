// pages/user/follow_add/follow_add.js
var util = require('../../..//utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    avatarUrl: "",
    casArray: ['日常回访', '带看', '其他'],
    chengjiaoArray: ['未成交', '成交'],
    userName: '',
    mobile: '',
    Gender: 'female',
    casIndex: 0,
    dealIndex: 0,
    dormitoryId: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.dormitoryId){
      this.data.dormitoryId = options.dormitoryId;
    }
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
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })

  },
  bindCasPickerChange1: function (e) {
    this.setData({
      dealIndex: e.detail.value
    })

  },

  inputChange: function(e){
    this.setData({
      content: e.detail.value
    })
  },

  onRegister: function(){
    let self = this;
    if (this.data.content == "") {
      util.showErrorModal("内容不能为空");
      return;
    }

    util.request(app.data.apiurl + '/dormitory/addFollowUp', {
      deal: self.data.dealIndex,
      type: self.data.casIndex,
      openid: app.data.logininfo.openid,
      content: self.data.content,
      dormitoryId: self.data.dormitoryId
    }, function (res) {
      if (res.status > 0) {
        wx.showModal({
          title: "提示",
          content: "保存成功",
          showCancel: false,
          success: function () {
            wx.navigateBack({
              
            });
          }
        });
      } else {
        util.showErrorModal(res.data.message);
      }
    })
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
