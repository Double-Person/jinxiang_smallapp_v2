// pages/detail/detail.js
var {
  port
} = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList: [],
    sovleList: [],
    currentIndex: '',
    infectiousDiseases: [], //传染性疾病
    nonInfectiousDiseases: [], //非传染性疾病
    isDisabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var obj;
    let temp = Object.keys(options)
    this.setData({
      detailList: JSON.parse(temp)
    })
    // this.data.detailList.shift()
    for (let i of this.data.detailList) {
      i.value = i.value.split('|')
      let tempArr = []
      for (let x of i.value) {
        // console.log(x)
        // 生成多个数组
        let itemArr = new Array(x)
        obj = {}
        // 将单个数组转对象添加false属性
        for (let z of itemArr) {
          obj['keys'] = z;
          obj['check'] = false
        }
        itemArr = obj
        tempArr.push(itemArr)
      }
      i.value = tempArr
      this.setData({})
    }

    this.setData({
      sovleList: this.data.detailList,
      isDisabled:false
    })
    // console.log(obj)
    console.log(this.data.sovleList)

    // 传染性疾病
    this.setData({
      infectiousDiseases: this.data.sovleList.filter(item => item.type == 2),
      nonInfectiousDiseases: this.data.sovleList.filter(item => item.type == 3)
    })
  },
  // chazhao
  findArr(rempArr) {
    var itemArr = rempArr.findIndex((value, index, rempArr) => {
      return value.type == 3
    });
    console.log(itemArr)
  },

  // 选择传染疾病
  changeEstimate(item) {
    let that = this;
    let child = item.target.dataset.paindex;
    let parent = item.target.dataset.index
    //  console.log(child)//child
    //   console.log(item.target.dataset.item)
    //   console.log(parent)//parent
    that.data.infectiousDiseases[parent].value[child].check = !that.data.infectiousDiseases[parent].value[child].check
    this.setData({
      infectiousDiseases: that.data.infectiousDiseases
    })
  },
  // 非传染性疾病
  changeNotEstimate(item) {
    let that = this;
    let child = item.target.dataset.paindex;
    let parent = item.target.dataset.index
    that.data.nonInfectiousDiseases[parent].value[child].check = !that.data.nonInfectiousDiseases[parent].value[child].check
    this.setData({
      nonInfectiousDiseases: that.data.nonInfectiousDiseases
    })
  },

  // 点击下一张获取选择的疾病
  filterDiseases(target) {
    let that = this;
    let resultArr = []
    let arrs = [];
    let obj = {}
    //  遍历获取选中的选项
    for (let i of target) {
      for (let j = 0; j < i.value.length; j++) {
        if (i.value[j].check) {
          obj = {
            name: i.name,
            value: i.value[j].keys
          }
          arrs.push(obj)
        }
      }
    }

    console.log(arrs)
    arrs.sort(function(a, b) {
      return a.name - b.name;
    });
    for (let i = arrs.length - 1; i > 0; i--) {
      if (((arrs[i] != undefined && arrs[i].name) || undefined) == arrs[i - 1].name) {
        let tempObj = {}
        tempObj = {
          name: arrs[i].name,
          value: arrs[i].value + "|" + arrs[i - 1].value
        }
        resultArr.push(tempObj)
        arrs.splice(i - 1, 2)
      }
    }
    resultArr.push(...arrs)
    resultArr.filter(item => item)
    // console.log(resultArr)
    return resultArr
  },

  // 下一张
  nextGroup() {
    let that = this;
    let resultArr = []
    this.setData({
      isDisabled:true
    })

    // let infectious = that.filterDiseases(that.data.infectiousDiseases)
    // let nonInfectious = that.filterDiseases(that.data.nonInfectiousDiseases)

    // resultArr.push(...infectious, ...nonInfectious)

    resultArr.push(...that.data.infectiousDiseases, ...that.data.nonInfectiousDiseases)

let tempArr = resultArr.map(item => {
      return {
        name: item.name,//sure
        value: item.value.filter(items => items.check)
          .map(ma => ma.keys).join("|")
      }
    })
  .filter(temp => temp.value.length)
    

    console.log(tempArr)

    // return false;


    wx.request({
      url: port + '/mobile/expert_judge/save',
      method: 'POST',
      data: {
        photoIds: getApp().globalData.sessionData.photoIds,
        partIds: getApp().globalData.sessionData.partIds,
        expertId: getApp().globalData.userID,
        qrCodeId: getApp().globalData.sessionData.qrCodeId,
        samplePlantId: getApp().globalData.sessionData.samplePlantId,
        varietiesId: getApp().globalData.sessionData.varietiesId,
        stageId: getApp().globalData.sessionData.stageId,
        rating: getApp().globalData.sessionData.rating,
        // disease: JSON.stringify(resultArr),
        disease: JSON.stringify(tempArr),
      },
      success(res) {
        if (res.data.code == 0) {
          wx.redirectTo({
            url: '/pages/evaluate/evaluate'
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

    

    // console.log(resultArr)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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