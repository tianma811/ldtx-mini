var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    imgPath: '',
    dormitory: {}
  },
  onLoad: function (options) { 
    wx.showShareMenu({
      withShareTicket: true
    });   
    let self = this;

    util.request(
      app.data.apiurl + '/wechat/createDormitoryQrCode', {
        id: options.dormitoryId + "-" + app.data.logininfo.wechatUserNumber
      },
      function (res) {
        self.setData({
          qrcode: app.data.fileurl + res.data
        })
      }
    );

    // util.request(
    //   app.data.apiurl + '/dormitory/dormitoryInfo', {
    //     id: options.id,
    //   },
    //   function (res) {
    //     self.setData({
    //       dormitory: res.data,
    //       imgPath: app.data.fileurl + res.data.images.split(",")[0]
    //     });

        
    //   }
    // );

    
  },
  onReady: function (e) {
    
  },

  saveImage: function(e){
    let self = this;
    wx.showModal({
      title: '',
      content: "是否保存图片",
      showCancel: true,
      success: function () {
        wx.getSetting({
          success: function (res) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: function (res) {
                console.log("授权成功");
                var imgUrl = self.data.qrcode;
                wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                  url: imgUrl,
                  success: function (res) {
                    // 下载成功后再保存到本地
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                      success: function (res) {
                        wx.showToast({
                          title: '成功保存到相册',
                          icon: 'success'
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
  
})