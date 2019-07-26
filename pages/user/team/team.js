var util = require('../../../utils/util.js');
var filter = require('../../../utils/filter.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stepList: ["总榜", "月榜"],
    orderAttr: 0,
    fileurl: getApp().data.fileurl,
    goodsList: [],
    dormitoryName: '',
    isLogin: false,
    keywords: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  tabClick: function (e) {
    this.setData({
      orderAttr: e.target.dataset.index
    })
  },

  onShow: function () {
    let self = this;
    util.request(
      app.data.apiurl + '/dormitory/getMyTeam', {
        openid: app.data.logininfo.openid,
      },
      function (res) {
        if(res.status){
          self.setData({
            staffList: res.data
          })
        }
      }
    );

    util.request(
      app.data.apiurl + '/dormitory/getMyTeam', {
        openid: app.data.logininfo.openid,
        type: "1"
      },
      function (res) {
        if (res.status) {
          self.setData({
            staffListOrderByMonth: res.data
          })
        }
      }
    );
  }
})