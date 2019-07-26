var util = require('../../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepList: ["二手房", "租房"],
    orderAttr: 0,
    collect: [],
    collectRentList: [],
    imgurl: app.data.imgurl,
    goodsimgurl: app.data.goodsimgurl,
    startX: 0, //开始坐标
    startY: 0
  },
  tabClick: function (e) {
    this.setData({
      orderAttr: e.target.dataset.index
    })
  },
  onLoad: function(Options) {
    if (!app.loginCheck()) {
      return;
    }
    var self = this;
    util.request(app.data.apiurl + '/dormitory/getMyCollect', {
      openid: app.data.logininfo.openid,
    }, function(res) {
      let data = res.data;
      for (var i = 0; i < data.length; i++) {
        var dormitory = data[i];
        if (dormitory.images) {
          dormitory.smallImage = app.data.fileurl + dormitory.images.split(",")[0]
        }
        dormitory.publishTime = dormitory.publishTime.substring(0, 10)
      }
      self.setData({
        collect: data.filter(a => { return a.type == "1" }),
        collectRentList: data.filter(a => { return a.type == "2" }),
      });
    });
  },
  goHome:function()
  {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goGoods: function(e) {
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + e.currentTarget.dataset.id,
    })

  },
  delCollect: function(e) {
    var self = this;
    util.request(app.data.apiurl + 'api/Collect/DelCollect', {
      rec_id: e.currentTarget.dataset.id,
    }, function(res) {
      self.data.collect.splice(e.currentTarget.dataset.index, 1)
      self.setData({
        collect: self.data.collect
      })
    });
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.collect.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
      {
        v.isTouchMove = false;
      }
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      collect: this.data.collect
    })
  },

  //滑动事件处理
  touchmove: function(e) {
    var
      that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.collect.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) {
          //右滑
          v.isTouchMove = false
        } else {
          //左滑
          v.isTouchMove = true
        }
      }
    })
    //更新数据
    that.setData({
      collect: that.data.collect
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y

    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
})