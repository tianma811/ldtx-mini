var util = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stepList: ["重点客户", "所有客户"],
    orderAttr: 0,
    fileurl: getApp().data.fileurl,
    goodsList: [],
    dormitoryName: '',
    isLogin: false,
    
    keywords: "",
    customerList: [],
    importantCustomerList:[]
  },
  tabClick: function (e) {
    this.setData({
      orderAttr: e.target.dataset.index
    })
  },
  onLoad: function (options) {
    //设置可转发
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onShow: function(){
    let self = this;
    util.request(
      app.data.apiurl + '/dormitory/selectMyCustomer', {
        openid: app.data.logininfo.openid,
      },
      function(res) {
        if(res.status){
          self.setData({
            customerList: res.data,
            importantCustomerList: res.data.filter(d => { return d.important == '1' })
          })
        }
      }
    );
  }
})