var util = require('../../utils/util.js');
var filter = require('../../utils/filter.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stepList: ["二手房", "租房"],
    orderAttr: 0,
    fileurl: getApp().data.fileurl,
    goodsList: [],
    dormitoryList: [],
    dormitoryRentList: [],
    dormitoryName: '',
    isLogin: false,
    lunboImgs: [],
    logininfo: {},
    
    keywords: "",
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let preData = window.getCurrentPages()[window.getCurrentPages().length - 2].data;
    let data = {};
    for (key in preData) {
      data[key] = preData[key]
    }
    this.setData(data);
    wx.setNavigationBarTitle({
      title: this.data.dormitoryName
    })
  },
  tabClick: function (e) {
    this.setData({
      orderAttr: e.target.dataset.index
    })
  },
  scancodeEx: function() {
    // 检查是否已经登录
    if (!app.loginCheck()) {
      return;
    }
    var self = this;
    wx.scanCode({
      success: function(res) {
        util.request(
          app.data.apiurl + 'api/Goods/AddToCart', {
            user_id: app.data.logininfo.user_id,
            goods_number: 1,
            goods_sn: res.result,
            goods_attr: "日本仓直邮"
          },
          function() {
            app.getCartCount(function(e) {
              self.setData({
                CartCount: e
              });
            });
            self.scancodeEx();
          }
        );
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  searchtopInput: function(e) {
    let self = this;
    this.setData({
      dormitoryName: e.detail.value
    });
  },
  searchtop: function(e) {
    let self = this;
    util.request(
      app.data.apiurl + '/dormitory/loadAllDormitory', {
        dormitoryName: self.data.dormitoryName,
        type: "1"
      },
      function (res) {
        if (res.status) {
          let data = res.data;

          for (var i = 0; i < data.length; i++) {
            var dormitory = data[i];
            if (dormitory.images) {
              dormitory.smallImage = app.data.fileurl + dormitory.images.split(",")[0]
            }
            dormitory.publishTime = dormitory.publishTime.substring(0, 10)
          }
          self.setData({
            dormitoryList: res.data
          });
        }

      }
    );

    util.request(
      app.data.apiurl + '/dormitory/loadAllDormitory', {
        dormitoryName: self.data.dormitoryName,
        type: "2"
      },
      function (res) {
        if (res.status) {
          let data = res.data;

          for (var i = 0; i < data.length; i++) {
            var dormitory = data[i];
            if (dormitory.images) {
              dormitory.smallImage = app.data.fileurl + dormitory.images.split(",")[0]
            }
            dormitory.publishTime = dormitory.publishTime.substring(0, 10)
          }
          self.setData({
            dormitoryRentList: res.data
          });
        }

      }
    );
  },
  
  goTop: function(e) {
    this.setData({
      scrollTop: 0
    });
  },
  onLoad: function (options) {
    if(options.scene){
      if(options.scene.length == 32){
        var agentId = decodeURIComponent(options.scene);
        app.data.agentId = agentId;
      }else{
        wx.redirectTo({
          url: '/pages/goods/goods?scene=' + options.scene,
        });
        return;
      }
      
    }

    this.setData({
      logininfo: app.data.logininfo
    })

    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    });
    if(app.data.logininfo.userType != '3'){

    
      if(!app.isLogin()){
        wx.redirectTo({
          url: '/pages/user/login/login',
        });
      } 
        else if (!app.isBindMobile()){
        wx.redirectTo({
          url: '/pages/user/phone/phone',
        });
      }
    }
  },
  onShow: function(){
    let self = this;

    util.request(
      app.data.apiurl + '/index/getBanner', {},function (res) {
        if (res.status) {
          let data = res.data;

          for (var i = 0; i < res.data.length; i++) {
            var lunbo = res.data[i];
            lunbo.img = app.data.fileurl + "/" + lunbo.img.split(",")[0];
          }

          self.setData({
            lunboImgs: res.data
          });
        }
      }
    );

    this.searchtop();
    
  }
 
  // startPullDownRefresh() {
  //   // wx.stopPullDownRefresh()
  // }
})