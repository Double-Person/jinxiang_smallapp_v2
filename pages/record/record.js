var network = require("../../utils/network.js");
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    options:{},
    recordList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    app.getLogin().then(function (res) {
      _this.setData({
        openid: res.data.openid,
        options: options
      })

      network.GET({
        httpUrl: "/mobile/manure_record/all",
        openid: _this.data.openid,
        data: {
          grow_area_id: _this.data.options.cityId,
          stage_id: _this.data.options.stageId
        },
        success: function (res) {
          if (res.data.code == 0) {
            _this.setData({
              recordList: res.data.data
            })
          }
          // code1005解绑后执行
          if (res.data.code == 1005) {
            wx.navigateBack({
              delta: 10
            })
          }
        }
      })


    })
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