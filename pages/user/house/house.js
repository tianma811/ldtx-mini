var util = require('../../../utils/util.js');
var filter = require('../../../utils/filter.js');
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
    dormitoryName: '',
    isLogin: false,
    belong: '3',

    keywords: "",

  },
  tabClick: function (e) {
    this.setData({
      orderAttr: e.target.dataset.index
    })
  },
  belongTabClick: function(e){
    this.setData({
      belong: e.target.id.split("-")[1]
    });
    this.search();
  },
  searchtopInput: function (e) {
    let self = this;
    this.setData({
      searchtop: e.detail.value
    });
  },
  searchtop: function (e) {
    let self = this;
    util.request(
      app.data.apiurl + '/web/dormitoryinfo/loadAllGrid', {
        dormitoryName: self.data.searchtop,
      },
      function (res) {
        let data = res.data;
        for (key in data) {
          if (data[key].labelNames) {
            data[key].labelNamesArr = data[key].labelNames.split(',');
          }
          if (data[key].smallImgs) {
            let sarr = JSON.parse(data[key].smallImgs);
            if (sarr.length > 0) {
              data[key].smallImgSin = sarr[0].filePath;
            }
          }
        }
        self.setData({
          goodsList: res.data
        });
      }
    );
  },

  goTop: function (e) {
    this.setData({
      scrollTop: 0
    });
  },
  onLoad: function (options) {
    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    });

    if (!app.isLogin()) {
      wx.redirectTo({
        url: '/pages/user/login_reg/login_reg',
      });
    }
  },
  onShow: function () {
    this.search();
  },

  search: function(){
    let self = this;
    util.request(
      app.data.apiurl + '/dormitory/loadAllDormitory', {
        dormitoryName: self.data.dormitoryName,
        type: "1",
        belong: self.data.belong,
        openid: app.data.logininfo.openid
      },
      function (res) {
        if (res.status) {
          let data = res.data;

          for (var i = 0; i < data.length; i++) {
            var dormitory = data[i];
            if (dormitory.images) {
              dormitory.smallImage = app.data.fileurl + dormitory.images.split(",")[0]
            }
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
        type: "2",
        belong: self.data.belong,
        openid: app.data.logininfo.openid
      },
      function (res) {
        if (res.status) {
          let data = res.data;

          for (var i = 0; i < data.length; i++) {
            var dormitory = data[i];
            if (dormitory.images) {
              dormitory.smallImage = app.data.fileurl + dormitory.images.split(",")[0]
            }
          }
          self.setData({
            dormitoryRentList: res.data
          });
        }

      }
    );
  }

  // startPullDownRefresh() {
  //   // wx.stopPullDownRefresh()
  // }
})