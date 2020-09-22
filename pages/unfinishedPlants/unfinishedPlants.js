// pages/unfinishedPlants/unfinishedPlants.js
var network = require("../../utils/network.js");
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    options: {},
    plantList:[],
    shot:"",
    collectionText:""
  },
  backed() {
    app.collection=false
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    app.getLogin().then(function (res) {
      _this.setData({
        openid: res.data.openid,
        options:options
      })

      network.GET({
        httpUrl: "/mobile/sample_plant/not_collect_list",
        openid: _this.data.openid,
        data: {
          growAreaId: _this.data.options.growerId,
          sampleStageId: _this.data.options.stageId,
        },
        success: function (res) {
          if (res.data.code == 0) {
            console.log(res)
            
            if (res.data.data.list!="" && res.data.data.list instanceof Array && res.data.data.list.length > 0){
              _this.setData({
                plantList: res.data.data.list,
                shot:true
              })
            }else{
              if (app.collection){
                _this.data.collectionText ="您已完成采集，没有未完成的植株了"
              }else{
                _this.data.collectionText = "请先扫描植株开始采集"                
              }
              _this.setData({
                shot:false,
                collectionText: _this.data.collectionText
              })
            }
            console.log(res.data.data.list != "")
            console.log(res.data.data.list instanceof Array)
            console.log(res.data.data.list.length > 0)
          }
          // code1005解绑后执行
          if (res.data.code == 1005 && _this.data.options.cityId !== undefined) {
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
    app.collection = false
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