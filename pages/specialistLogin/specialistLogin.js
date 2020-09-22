var network = require("../../utils/network.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    isNull: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 用户名
  updateValueUser(e) {
    let values = e.detail && e.detail.value
    this.setData({
      username: values
    })
    this.estimate()
  },
  // 密码
  updateValuePwd(e) {
    let values = e.detail && e.detail.value
    this.setData({
      password: values
    })
    this.estimate()
  },
  /**
   * 判断用户名和密码是否为空
   */
  estimate() {
    if (this.data.username != '' && this.data.password != "") {
      this.setData({
        isNull: false
      })
    }
  },

  login() {
    let that = this;
    if (this.data.isNull) {
      return false
    }
    this.setData({
      isNull: true
    })
    network.GET({
      httpUrl: "/system/login",
      data: {
        username: this.data.username,
        password: this.data.password
      },
      success(res) {
        if (res.data.code == 0) {
          console.log(res)
          app.globalData.userID = res.data.data.userID
          wx.navigateTo({
            url: '/pages/evaluate/evaluate',
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            isNull: false
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})