var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    //dormitoryId:"",
    dormitoryName:"",
    dormitoryNumber:"",
    unitNumber:"",
    area:0,
    price:0,
    roomNumber:"",
    roomType:"1室0厅",
    agent:"",
    address:"",
    telephone:"",
    profit:0,
    remark:"",
    images:[],
    localImagePath: [],
    index: 0,
    types: ["房屋出售", "房屋出租"],
    huxing: ["1室0厅", "1室1厅", "1室2厅", "1室3厅", "1室4厅", "2室0厅", "2室1厅", "2室2厅", "2室3厅", "2室4厅", "3室0厅", "3室1厅", "3室2厅", "3室3厅", "3室4厅", "其他"],
    huxingIndex: 0,
    bindSource: [], //绑定到页面的数据，根据用户输入动态变化
    hideScroll: true,
    building_dictionary_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  type: function (e) {
    this.setData({
      index: e.detail.value,
      type: parseInt(e.detail.value) + 1
    }) },
  //dormitoryId: function (e) { this.data.dormitoryId = e.detail.value },
  dormitoryName: function (e) { this.data.dormitoryName = e.detail.value },
  dormitoryNumber: function (e) { this.data.dormitoryNumber = e.detail.value },
  unitNumber: function (e) { this.data.unitNumber = e.detail.value },
  area: function (e) { this.data.area = e.detail.value },
  price: function (e) { this.data.price = e.detail.value },
  roomNumber: function (e) { this.data.roomNumber = e.detail.value },
  roomType: function (e) { 
    this.setData({
      huxingIndex: e.detail.value,
      roomType: this.data.huxing[e.detail.value]
    })
   },
  agent: function (e) { this.data.agent = e.detail.value },
  address: function (e) { this.data.address = e.detail.value },
  telephone: function (e) { this.data.telephone = e.detail.value },
  profit: function (e) { this.data.profit = e.detail.value },
  remark: function (e) { this.data.remark = e.detail.value },

  searchBuilding: function(e){
    let self = this;
    util.request(app.data.apiurl + '/dormitory/searchBuilding', {
      buildingName: e.detail.value,
    }, function (res) {
      if (res.status > 0) {
        // 如果匹配结果存在，那么将其返回，相反则返回空数组
        if (res.data.length != 0) {
          self.setData({
            // 匹配结果存在，显示自动联想词下拉列表
            hideScroll: false,
            bindSource: res.data,
            arrayHeight: res.data.length * 71
          })
        } else {
          // this.setData({
          //   // 匹配无结果，不现实下拉列表
          //   hideScroll: true,
          //   bindSource: []
          // })
        }
      } 
    })

    
  },

  // 用户点击选择某个联想字符串时，获取该联想词，并清空提醒联想词数组
  itemtap: function (e) {
    let id = e.target.id;

    var buildingInfo = {};
    
    for(var i = 0 ; i < this.data.bindSource.length; i++){
      buildingInfo = this.data.bindSource[i];
      break;
    }

    this.setData({
      // .id在wxml中被赋值为{{item}}，即当前遍历的元素值
      building_dictionary_id: id,
      dormitoryName: buildingInfo.buildingName,
      unitNumber: buildingInfo.unitNumber,
      address: buildingInfo.address,
      dormitoryNumber: buildingInfo.buildingNumber,
      roomNumber: buildingInfo.houseNumber,
      // 当用户选择某个联想词，隐藏下拉列表
      hideScroll: true,
      bindSource: []
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  saveDormitory:function(){
    let self = this;
    if (this.data.type == "") { util.showErrorModal("类型不能为空"); return; }
    //if (this.data.dormitoryId == "") { util.showErrorModal("房源编号不能为空"); return; }
    if (this.data.building_dictionary_id == "") { util.showErrorModal("楼盘字典不正确"); return; }
    if (this.data.area == "") { util.showErrorModal("面积不能为空"); return; }
    if (this.data.price == "") { util.showErrorModal("价格不能为空"); return; }
    if (this.data.roomType == "") { util.showErrorModal("户型不能为空"); return; }
    // if (this.data.agent == "") { util.showErrorModal("经纪人不能为空"); return; }
    // if (this.data.telephone == "") { util.showErrorModal("联系方式不能为空"); return; }
    if (this.data.profit == "") { util.showErrorModal("预计收益不能为空"); return; }

    util.request(app.data.apiurl + '/dormitory/saveDormitory', {
      type: self.data.type,
      buildingDictionaryId: self.data.building_dictionary_id,
      area: self.data.area,
      price: self.data.price,
      roomType: self.data.roomType,
      // agent: self.data.agent,
      // telephone: self.data.telephone,
      profit: self.data.profit,
      images: self.data.images.join(","),
      remark: self.data.remark,
      openid: app.data.logininfo.openid
    }, function (res) {
      if (res.status > 0) {
        wx.showModal({
          title: "提示",
          content: "保存成功",
          showCancel: false,
          success:function(){
            wx.switchTab({
              url: "/pages/index/index"
            });
          }
        });
        
      } else {
        util.showErrorModal(res.data.message);
      }
    })
  },

  upload: function(){
    var self = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        
        wx.uploadFile({
          url: app.data.apiurl + "/upload/uploadImage", //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'openid': app.data.logininfo.openid
          },
          success(res) {
            var data = JSON.parse(res.data)
            if(data.status){
              self.data.images.push(data.data);
              var localImagePath = self.data.localImagePath;
              localImagePath.push(tempFilePaths[0]);
              self.setData({localImagePath: localImagePath});
            }
            
            //do something
          }
        })
      }
    })
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