var network = require("../../utils/network.js");
var {
  port
} = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plantsDetails: [],
    plantsPhotos: [],
    lookLikes: [], //植株评定页面的涨势评定 优|良|中|差|不确定|看不清
    currentIndex: -1,
    checkEstimate: '', // 长势评定 优良中差
    photoIds: [], // 
    partIds: [], // 
    noData: false,
    formatDate: '',
    noDataMessage:'',//
  },

  firstLoad() {
    var that = this;
    wx.showToast({
      title: '成功',
      icon: 'loading',
      title:'加载中……',
      duration: 50000
    })
    wx.request({
      url: port + '/mobile/expert_judge/list',
      data: {
        id: getApp().globalData.userID // || 208
      },
      success(res) {

        if (res.data.code == 0) {
          that.setData({
            lookLikes: res.data.data.diseaseList[0].value.split("|"),
            plantsDetails: res.data.data.diseaseList,
            plantsPhotos: res.data.data.expertPlantPhotos,
            photoIds:[],
            partIds:[]
            // formatDate: res.data.data.expertPlantPhotos[0].createTime
          })
          // 时间格式处理
          var times = new Date(res.data.data.expertPlantPhotos[0].createTime)
          that.setData({
            formatDate: times.getFullYear() + '年' + (times.getMonth() + 1).toString().padStart(2, '0') + '月' + times.getDate().toString().padStart(2, '0') + '日' + ' ' + times.getHours() + ':' + times.getMinutes()
          })
          for (let i of that.data.plantsPhotos) {
            that.data.photoIds.push(i.photoId)
            that.data.partIds.push(i.partId)
          }

        }
        // 没有数据时
        if (res.data.message) {
          that.setData({
            noData: true,
            noDataMessage: res.data.message
          })
        }
      },
      fail(err){
        console.log(err)
      },
      complete(){
        wx.hideToast({})
      }
    })

  },
  /**
   * 长势评定 优良中差
   */
  changeEstimate(item) {
    this.setData({
      currentIndex: item.target.dataset.index,
      checkEstimate: item.target.dataset.item
    })
  },
  /**
   * 第一次提交
   */
  firstSubmit() {
    var that = this
    let obj = {
      name: this.data.plantsDetails[0].name,
      value: this.data.checkEstimate
    }
    wx.request({
      url: port + '/mobile/expert_judge/save',
      method: 'POST',
      data: {
        photoIds: this.data.photoIds.join("|"),
        partIds: this.data.partIds.join("|"),
        expertId: getApp().globalData.userID,
        qrCodeId: this.data.plantsPhotos[0].qrCodeId,
        samplePlantId: this.data.plantsPhotos[0].samplePlantId,
        varietiesId: this.data.plantsPhotos[0].varietiesId,
        stageId: this.data.plantsPhotos[0].stageId,
        rating: this.data.checkEstimate,
        disease: JSON.stringify([{}]),
      },
      success(res) {
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 2000
        })
        
        if (res.data.code == 0) {
          that.firstLoad()
          that.setData({
            currentIndex: -1,
            checkEstimate: '',
            photoIds: [],
            partIds: [],
            plantsPhotos: [],
            plantsDetails: [],
            lookLikes: [], //植株评定页面的涨势评定 优|良|中|差|不确定|看不清       
          })
         
        }
      }
    })
  },

  /**
   * 下一张
   */
  nextGroup() {
    if (this.data.checkEstimate == '') {
      wx.showToast({
        title: '请先评价',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    this.firstSubmit()
    //this.firstLoad()
  },
  /**
   *  详细点评
   */
  detail() {
    if (this.data.checkEstimate == '') {
      wx.showToast({
        title: '请先评价',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let obj = {
      name: this.data.plantsDetails[0].name,
      value: this.data.checkEstimate
    }
    getApp().globalData.rating = obj

    getApp().globalData.sessionData = {
      photoIds: this.data.photoIds.join("|"),
      partIds: this.data.partIds.join("|"),
      expertId: getApp().globalData.userID,
      qrCodeId: this.data.plantsPhotos[0].qrCodeId,
      samplePlantId: this.data.plantsPhotos[0].samplePlantId,
      varietiesId: this.data.plantsPhotos[0].varietiesId,
      stageId: this.data.plantsPhotos[0].stageId,
      rating: this.data.checkEstimate,
      disease: JSON.stringify(obj)
    }

    this.data.plantsDetails.shift()
    var detailParmas = JSON.stringify(this.data.plantsDetails)
    wx.redirectTo({
      url: '/pages/detail/detail?' + detailParmas,
    })
  },

  // 图片预览
  previewImages() {
    let previewImageList = []
    for (let i of this.data.plantsPhotos) {
      previewImageList.push(i.photoImg)
    }

    wx.previewImage({
      // current: previewImageList[0], // 当前显示图片的http链接
      urls: previewImageList // 需要预览的图片http链接列表
    })
  },
  binderror(err){
    console.log(err)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.firstLoad()

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
    this.firstLoad()
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