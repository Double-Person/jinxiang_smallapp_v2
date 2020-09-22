var network = require("../../utils/network.js");
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu:false,
    options:{},
    regionName:{},
    regionInfo:{},
    openid: "",
  },

  // 打开采集界面
  openCollection(e){
    var _this=this;
    var item = e.currentTarget.dataset.item
    console.log(item)
    wx.navigateTo({
      url: `../collection/collection?subId=${item.subVarietiesId}&cityId=${item.id}&cityName=${item.name}&varietiesName=${item.varietiesName}&subName=${item.subVarietiesName}&plantNum=${item.plantNum}&userId=${_this.data.options.userId}&plantName=${item.growerName}&regionId=${_this.data.options.regionId}&sampleNum=${item.sampleNum}&growerId=${item.growerId}`,
    })
  },
  // 打开菜单
  openMenu(){
    this.data.menu=!this.data.menu
    this.setData({
      menu: this.data.menu
    })
  },
  // 选择大区
  selectedCity(e){
    var _this=this
    for (let i of _this.data.regionName){
      i.isSelected=false;
      if (i.id == e.currentTarget.dataset.item.id){
        i.isSelected=true;
      }
    }
    this.setData({
      options:{
        cityName: e.currentTarget.dataset.item.regionName,
        regionId: e.currentTarget.dataset.item.id,
        userName: _this.data.name,
        userId:_this.data.options.userId
      },
      regionName: _this.data.regionName
    })
    this.getCity();
    this.setData({
      menu:false
    })
  },
  // 获取大区详细数据
  getCity(){
    var _this=this;
    network.GET({
      httpUrl: "/mobile/grow_area/all",
      openid: _this.data.openid,
      data: {
        region_id: _this.data.options.regionId
      },
      success: function (res) {
        if (res.data.code == 0) {
          _this.setData({
            regionInfo: res.data.data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this
    app.getLogin().then(function (res) {
      _this.setData({
        openid: res.data.openid,
        options: options,
        name:options.userName
      })

      network.GET({
        httpUrl: "/mobile/region/all",
        openid: _this.data.openid,
        success: function (res) {
          if (res.data.code == 0) {
            for(let i of res.data.data){
              i.isSelected=false;
              if (i.id == _this.options.regionId){
                i.isSelected=true
              }
            }
            _this.setData({
              regionName:res.data.data
            })
          }
          // code1005解绑后执行
          if (res.data.code == 1005) {
            wx.navigateBack({
              data:10
            })
          }
        }
      })
      _this.getCity()
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