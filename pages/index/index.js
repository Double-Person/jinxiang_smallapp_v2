var network = require("../../utils/network.js");
//获取应用实例
const app = getApp()

Page({
  data: {
    isUserInfo: false,
    openid: "",
    userInfo: "",
    name: "",
    phone: "",
    isPhone: false,
    disabled: true,
    getstorage: "",
    tips: true
  },
  specialistLogin() {
    wx.navigateTo({
      url: '/pages/specialistLogin/specialistLogin',
    })
  },
  login() {
    var _this = this

    network.POST({
      httpUrl: "/mobile/collector/login",
      // openid: _this.data.openid,
      data: {
        wx_nick_name: _this.data.userInfo.nickName,
        wx_open_id: _this.data.openid,
        wx_avatar: _this.data.userInfo.avatarUrl,
        name: _this.data.name,
        mobile: _this.data.phone
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.setStorage({
            key: "userinfo",
            data: _this.data.name + '|' + _this.data.phone + '|' + res.data.data.regionId + '|' + res.data.data.regionName + '|' + res.data.data.id,
            success: function(res) {
              if (res.errMsg == "setStorage:ok") {

              }
            }
          })


          wx.navigateTo({
            url: `../homePage/homePage?regionId=${res.data.data.regionId}&cityName=${res.data.data.regionName}&userName=${_this.data.name}&userId=${res.data.data.id}`,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })




  },
  // 隐藏tips
  tipsHide() {
    this.setData({
      tips: false
    })
  },
  // 获取用户输入名称
  getName(e) {
    this.setData({
      name: e.detail
    })
  },
  // 获取用户手机号
  getPhone(e) {
    var _this = this
    this.setData({
      phone: e.detail
    })
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var myreg = /^1[123456789]\d{9}$/;
    if (myreg.test(e.detail)) {
      _this.setData({
        isPhone: false,
        disabled: false
      })
    } else {
      _this.setData({
        isPhone: true,
      })
    }
  },

  getUserInfo: function(e) {
    var _this = this
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    _this.setData({
      isUserInfo: false
    })
  },

  onLoad: function() {
    var _this = this;

    app.getLogin().then(function(res) {
      _this.setData({
        openid: res.data.openid
      })

      console.log(app.globalData.userInfo)
      wx.getStorageInfo({
        key: "userinfo",
        success: function(res) {
          // _this.setData({
          //   getstorage: wx.getStorageSync('userinfo').split("|")
          // })
          _this.setData({
            name: wx.getStorageSync('userinfo').split("|")[0],
            phone: wx.getStorageSync('userinfo').split("|")[1],
            disabled: false
          })

          network.POST({
            httpUrl: "/mobile/collector/login",
            // openid: _this.data.openid,
            data: {
              wx_nick_name: app.globalData.userInfo.nickName,
              wx_open_id: _this.data.openid,
              wx_avatar: app.globalData.userInfo.avatarUrl,
              name: _this.data.name,
              mobile: _this.data.phone
            },
            success: function(res) {
              if (res.data.code == 0) {
                wx.setStorage({
                  key: "userinfo",
                  data: _this.data.name + '|' + _this.data.phone + '|' + res.data.data.regionId + '|' + res.data.data.regionName + '|' + res.data.data.id,
                  success: function(res) {
                    if (res.errMsg == "setStorage:ok") {

                    }
                  }
                })


                wx.navigateTo({
                  url: `../homePage/homePage?regionId=${res.data.data.regionId}&cityName=${res.data.data.regionName}&userName=${_this.data.name}&userId=${res.data.data.id}`,
                })

              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })

        }
      })

      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {

            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                _this.setData({
                  userInfo: res.userInfo,
                  isUserInfo: false
                })
              }
            })
          } else {
            _this.setData({
              isUserInfo: true
            })
          }
        }
      })
    })
  },
})