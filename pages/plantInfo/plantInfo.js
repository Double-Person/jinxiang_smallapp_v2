var network = require("../../utils/network.js");
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    openid: "",
    plantInfo: {},
    age:"",
    name:""
  },
  // 拍照采集
  sampleCollection() {
    var _this=this
    if(_this.data.age==""){
      wx.showToast({
        title: '请输入数龄',
        icon:"none"
      })
      return;
    }
    // if (_this.data.name == "") {
    //   wx.showToast({
    //     title: '请输入植株名称',
    //     icon: "none"
    //   })
    //   return;
    // }
    network.POST({
      httpUrl: "/mobile/sample_plant/save",
      openid: _this.data.openid,
      data: {
        code: _this.data.options.qrCode,
        age: _this.data.age,
        grow_area_id: _this.data.options.cityId,
        name: _this.data.name,
        stage_id: _this.data.options.stageId,
        region_id: _this.data.options.regionId,
        collector_id:_this.data.options.userId
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.redirectTo({
            url: `../acquisitionPhase/acquisitionPhase?qrCode=${_this.data.options.qrCode}&stage=${_this.data.options.stage}&stageId=${_this.data.options.stageId}&subId=${_this.data.options.subId}`,
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
  },

  // 获取树龄
  getAge(e){
    this.setData({
      age: e.detail.value
    })
  },
  // 获取树龄
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    app.getLogin().then(function(res) {
      _this.setData({
        openid: res.data.openid,
        options: options
      })


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