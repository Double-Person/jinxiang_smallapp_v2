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
  },
  // 添加施肥
  addFertilizer(e) {
    var _this = this
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../applyFertilizer/applyFertilizer?userId=${_this.data.options.userId}&cityId=${_this.data.options.cityId}&regionId=${_this.data.options.regionId}&jieduanId=${item.stageTypeId}`,
    })
  },
  // 打开未完成的植株
  addUnfinishedPlants(e){
    var _this=this;
    var item = e.currentTarget.dataset.item
    console.log(item)
    if (item.stageStatus=="已完成"){
      app.collection=true
    }
    wx.navigateTo({
      url: `../unfinishedPlants/unfinishedPlants?growerId=${_this.data.options.cityId}&stageId=${item.stageTypeId}&stageTypeName=${item.stageTypeName}&cityName=${_this.data.options.cityName}&varietiesName=${_this.data.options.varietiesName}&subName=${_this.data.options.subName}&plantName=${_this.data.options.plantName}`,
    })
  },
  // 查看记录
  lookRecord(e) {
    var _this = this
    var item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../record/record?cityId=${_this.data.options.cityId}&stageId=${item.stageTypeId}`,
    })
  },
  // 扫码
  sweepCode(e) {
    var _this = this;
    var item = e.currentTarget.dataset.item;
    console.log(item)
    if (item.manureRecordNum==0){
      wx.navigateTo({
        url: `../applyFertilizer/applyFertilizer?userId=${_this.data.options.userId}&cityId=${_this.data.options.cityId}&regionId=${_this.data.options.regionId}&jieduanId=${item.stageTypeId}&sampleNum=${_this.data.options.sampleNum}&growerId=${_this.data.options.growerId}&first=first&stageTypeName=${item.stageTypeName}&subVarietiesId=${item.subVarietiesId}&daqu=${_this.data.options.cityName}&varietiesName=${_this.data.options.varietiesName}&subName=${_this.data.options.subName}&userName=${_this.data.options.plantName}`,
      })
    }else{
      wx.scanCode({
        success(res) {
          var qrCode = res.result
          // 判断是否是当前种植户
          network.GET({
            httpUrl: "/mobile/sample_plant/judge",
            openid: _this.data.openid,
            data: {
              code: qrCode,
              grow_area_id: _this.data.options.cityId,
              grower_id: _this.data.options.growerId,
              number: _this.data.options.sampleNum,
              stage_id: item.stageTypeId
            },
            success: function (res) {
              if (res.data.code == 0) {
                wx.navigateTo({
                  url: `../acquisitionPhase/acquisitionPhase?qrCode=${qrCode}&stage=${item.stageTypeName}&stageId=${item.stageTypeId}&subId=${item.subVarietiesId}`,
                })
              }
              if (res.data.code == 2) {
                wx.navigateTo({
                  url: `../plantInfo/plantInfo?qrCode=${qrCode}&cityId=${_this.data.options.cityId}&stageId=${item.stageTypeId}&daqu=${_this.data.options.cityName}&varietiesName=${_this.data.options.varietiesName}&subName=${_this.data.options.subName}&userName=${_this.data.options.plantName}&stage=${item.stageTypeName}&subId=${item.subVarietiesId}&userId=${_this.data.options.userId}&regionId=${_this.data.options.regionId}`,
                })
              }
              if (res.data.code == 1 || res.data.code == 3) {
                wx.showToast({
                  title: res.data.message,
                  icon: "none",
                  duration: 2000
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
        }
      })
    }
    

  },

  // 获取采集区列表
  getAcquisitionList(){
    var _this=this;
    network.GET({
      httpUrl: "/mobile/sample_stage/all",
      openid: _this.data.openid,
      data: {
        grow_area_id: _this.data.options.cityId,
        subVarieties_id: _this.data.options.subId,
        number: _this.data.options.sampleNum
      },
      success: function (res) {
        if (res.data.code == 0) {
          _this.setData({
            plantList: res.data.data
          })
        }
        // code1005解绑后执行
        if (res.data.code == 1005 && _this.data.options.cityId!==undefined) {
          wx.navigateBack({
            delta: 10
          })
        }
      }
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
      
      _this.getAcquisitionList()
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
    this.getAcquisitionList()
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