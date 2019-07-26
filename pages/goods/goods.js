var util = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
     fileurl: getApp().data.fileurl,
    hidden: true,
    nocancel: false,
    footAddtell: false,
    dormitory: {},
    lunboImgs:[],
    isCollect: '0',
    logininfo:{},
    viewShowed: true,
    code: ''
  },
  footAddtell: function () {
    this.setData({
      hidden: true
    });
  },
  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  confirm: function () {
    let self = this;
    wx.login({
      success(res) {
        self.setData({
          code: res.code
        })
      }
    })


    this.setData({
      hidden: true,
      viewShowed: false
    });
    
  },  
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  onShareAppMessage() {
    return {
      title: this.data.dormitory.dormitoryName,
      path: '/pages/goods/goods?id=' + this.data.dormitory.id
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    var dormitoryId = "";
    var id = "";
    var wechatUserNumber = "";
    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    });

    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      dormitoryId = scene.split("-")[0];
      wechatUserNumber = scene.split("-")[1];
      if(!app.isLogin()){
        wx.redirectTo({
          url: '/pages/user/login/login?url=' + encodeURIComponent("/pages/goods/goods?scene=" + options.scene),
        })
      }else{
        util.request(
          app.data.apiurl + '/dormitory/browseDormitory', {
            openid: app.data.logininfo.openid,
            dormitoryId: dormitoryId,
            wechatUserNumber: wechatUserNumber
          },
          function (res) {
            wx.setStorageSync(app.data.logininfokey, res.data);
            app.data.logininfo = res.data;
          }
        );
      }
    }else{
      id = options.id;
      self.setData({
        logininfo: app.data.logininfo
      })
    }

    if(!app.isLogin()){
      return;
    }

    util.request(
      app.data.apiurl + '/dormitory/dormitoryInfo', {
        dormitoryId: dormitoryId,
        id: id
      },
      function(res) {
        var lunboImgs = res.data.images.split(",");;

        for (var i = 0; i < lunboImgs.length; i++){
          lunboImgs[i] = app.data.fileurl + "/" + lunboImgs[i];
        }

        self.setData({
          dormitory: res.data,
          lunboImgs: lunboImgs
        })

        wx.setNavigationBarTitle({
          title: res.data.dormitoryName
        })

        util.request(
          app.data.apiurl + '/dormitory/getCollect', {
            dormitoryId: res.data.id,
            openid: app.data.logininfo.openid
          },
          function (res) {
            if (res.status) {
              self.setData({
                isCollect: res.data
              });
            }
          }
        );
      }
    );

    

    if (options.scene){
      self.setData({
        hidden: false
      })
    }

  },

  onShow: function(){
  },
  
  viewImg: function(e){
    getApp().viewImg(e);
  },

  call: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.dormitory.agentMobile //仅为示例，并非真实的电话号码
    })
  },

  shareQrcode: function(e){
    wx.navigateTo({
      url: '/pages/haibao/haibao?dormitoryId=' + this.data.dormitory.dormitoryId,
    });
  },

  followUpMore: function(){
    wx.navigateTo({
      url: '/pages/user/follow/follow?dormitoryId=' + this.data.dormitory.id,
    });
  },

  collect: function(){
    let self = this;
    util.request(app.data.apiurl + "/dormitory/collectDormitory", {
      dormitoryId: self.data.dormitory.id,
      openid: app.data.logininfo.openid,
      isCollect: self.data.isCollect == '1'? '0' : '1'
    }, function (r) {
      if (r.status > 0) {
        self.setData({
          isCollect: self.data.isCollect == '1' ? '0' : '1'
        });
      } else {

      }
    });
  },

  getPhoneNumber: function(e){
    let self = this;
    util.request(app.data.apiurl + "/wechat/savePhoneNumber", {
      code: self.data.code,
      iv: e.detail.iv,
      encryptData: e.detail.encryptedData
    }, function (r) {
      self.setData({
        viewShowed: true
      });
    });
  }
  
})