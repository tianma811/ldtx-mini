var util = require('../../utils/util.js');
var filter = require('../../utils/filter.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderAttr: 0,
    fileurl: getApp().data.fileurl,
    goodsList: [],
    dormitoryName: '',
    isLogin: false,
    chatList: [],
    keywords: "",
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onLoad: function (options) {
    
  },
  onShow: function(){
    let self = this;
    util.request(
      app.data.apiurl + '/message/getChatList', {
        openid: app.data.logininfo.openid,
      },
      function(res) {
        var data = res.data;
        for(var i = 0 ; i < data.length; i++){
          var chat = data[i];
          if(chat.openid1 == app.data.logininfo.openid){
            chat.nickname = chat.nickname2;
            chat.headimgurl = chat.headimgurl2;
            chat.receiver = chat.openid2;
          }else{
            chat.nickname = chat.nickname1;
            chat.headimgurl = chat.headimgurl1;
            chat.receiver = chat.openid1;
          }
        }
        self.setData({
          chatList: res.data
        })
      }
    );
  }
})