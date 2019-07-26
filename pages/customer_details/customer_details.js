var util = require('../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stepList: ["跟进记录", "成交信息"],
    orderAttr: 0,
    fileurl: getApp().data.fileurl,
    goodsList: [],
    dormitoryName: '',
    customerInfo: {},
    isLogin: false,
    keywords: "",
  },
  tabClick: function (e) {
    this.setData({
      orderAttr: e.target.dataset.index
    })
  },
  onLoad: function (options) {
    let self = this; 
    util.request(
      app.data.apiurl + '/dormitory/getCustomerInfo', {
        id: options.id,
      },
      function (res) {
        self.setData({
          customerInfo: res.data
        });
      }
    );

    util.request(app.data.apiurl + "/dormitory/getFollowUpByCustomerId", {
      customerId: options.id
    }, function (r) {
      if (r.status > 0) {

        self.setData({
          followUpList: r.data.filter(d => { return d.deal == '0' }),
          dealList: r.data.filter(d => { return d.deal == '1' }),
        });
      }
    });
    
  },
  onShow: function(){
    
  }
})