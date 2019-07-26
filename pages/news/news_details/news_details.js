// pages/contact/contact.js

var util = require('../../../utils/util.js');
var filter = require('../../../utils/filter.js');
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
var receiver = '';

/**
 * 初始化数据
 */
function initData(that, msgList) {
  

  inputVal = '';

  msgList = [{
    speaker: 'server',
    contentType: 'text',
    content: '欢迎来到英雄联盟，敌军还有30秒到达战场，请做好准备！'
  },
  {
    speaker: 'customer',
    contentType: 'text',
    content: '我怕是走错片场了...'
  }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    receiver = options.receiver;
    if (receiver) {
      util.request(
        app.data.apiurl + '/message/getChatDetailList', {
          openid: app.data.logininfo.openid,
          another: receiver,
        },
        function (res) {
          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            var chat = data[i];
            if (chat.sender == app.data.logininfo.openid) {
              chat.speaker = "customer";
            } else {
              chat.speaker = "server";
            }
            chat.headimgurl = chat.senderHeadimgurl;
            chat.contentType = 'text';
          }
          msgList = res.data;
          self.setData({
            msgList: res.data,
            inputVal: ''
          })
        }
      );
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value,
      headimgurl: app.data.logininfo.headimgurl
    })
    this.sendToServer(e.detail.value);
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
  },

  send: function(){
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: this.data.inputVal,
      headimgurl: app.data.logininfo.headimgurl
    })
    this.sendToServer(this.data.inputVal);
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
    
  },

  sendToServer: function (content){
    util.request(
      app.data.apiurl + '/message/sendMessage', {
        openid: app.data.logininfo.openid,
        receiver: receiver,
        content: content
      },
      function (res) {
        
      }
    );
  },

  bindInput: function(e){
    this.setData({
      inputVal: e.detail.value
    })
  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})