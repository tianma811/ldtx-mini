var util = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer:{},
    importantArray: ["普通客户", "重点客户"],
    important: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    util.request(
      app.data.apiurl + '/dormitory/getCustomerInfo', {
        id: options.id,
      },
      function (res) {
        if(res.data.wx_number){
          res.data.wxNumber = res.data.wx_number;
        }
        if(res.data.house_number){
          res.data.houseNumber = res.data.house_number;
        }
        
        self.setData({
          customer: res.data
        });
      }
    );
  },
  name: function (e) { this.data.customer.name = e.detail.value  },
  mobile: function (e) { this.data.customer.mobile = e.detail.value },
  wxNumber: function (e) { this.data.customer.wxNumber = e.detail.value },
  houseNumber: function (e) { this.data.customer.houseNumber = e.detail.value },
  age: function (e) { this.data.customer.age = e.detail.value},
  important: function (e) { this.data.customer.important = e.detail.value; this.setData({
    customer : this.data.customer
  }) },

  onRegister: function(){
    util.request(
      app.data.apiurl + '/dormitory/saveCustomerInfo', this.data.customer,
      function (res) {
        if(res.status){
          util.showErrorModal("保存成功");
        }
      }
    );
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