var network = require("../../utils/network.js");
var util = require("../../utils/util.js")
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:true,
    openid:"",
    allCities:[],
    options:{},
    brandIndex:[0,0],
    brandName:"",
    brandId:"",
    brandList:[],
    recordIndex: 0,
    recordName:"",
    recordList:[],
    recordId:"",
    date:"",
    company:{
      ke:false,
      mu:false,
      qu:false
    }, //施肥单位
    companyText:"",
    shifeiSum:0,
    resultList:[],
    resultId:"",
    disabled:true
  },

  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    var _this=this;
    this.setData({ checked: detail });
    // this.suoxuInfo();
    if(_this.data.checked){
      _this.setData({
        disabled:true
      })
    }else{
      _this.setData({
        disabled: false
      })
    }
  },

  // 选择品牌
  bindBrand(e){
    var _this=this
    console.log(e)
    var item=e.currentTarget.dataset.item;
    var index=e.detail.value;
    this.setData({
      brandIndex: e.detail.value,
      brandId: item.id,
      // brandName: item.productName
      brandName: _this.data.allCities[index[0]].bandTypeName + "#" + _this.data.allCities[index[0]].manureTypeFrontVoList[index[1]].productName
    })
    console.log(_this.data.allCities[index[0]].bandTypeName + "#" + _this.data.allCities[index[0]].manureTypeFrontVoList[index[1]].productName)
    this.suoxuInfo();
  },
  bindBrandPickerColumnChange(e){
    var _this = this;
    const data = {
      brandList: this.data.brandList,
      brandIndex: this.data.brandIndex
    }
    data.brandIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.brandIndex[0]) {
          case e.detail.value:
            data.brandList[1] = _this.data.allCities[e.detail.value].manureTypeFrontVoList;
            break
        }
        data.brandIndex[1] = 0
        break
    }
    this.setData(data)
  },

  // 选择施肥方式
  bindRecord(e){
    this.setData({
      recordName: this.data.recordList[e.detail.value].name,
      recordId: this.data.recordList[e.detail.value].id
    })
    this.suoxuInfo();
  },

  // 选择时间
  bindDateChange: function (e) {
    console.log(e)
    this.setData({
      date: e.detail.value
    })
    this.suoxuInfo();
  },

  // 选择单位
  selectCompany(e){
    var _this=this;
    var tab = e.currentTarget.dataset.tab;
    // 选择棵
    if(tab==1){
      _this.setData({
        company:{
          ke:true
        },
        companyText:"kg/棵"
      })
    }
    // 选择亩
    if (tab == 2) {
      _this.setData({
        company: {
          mu: true
        },
        companyText: "kg/亩"
      })
    }
    // 选择区
    if (tab == 3) {
      _this.setData({
        company: {
          qu: true
        },
        companyText: "kg/园区"
      })
    }
    _this.suoxuInfo();
  },

  // 获取施肥数量
  getshifeisum(e){
    this.setData({
      shifeiSum:e.detail.value
    })
    this.suoxuInfo();
  },

  // 选择施肥结果
  selectResult(e){
    var _this=this;
    var item = e.currentTarget.dataset.item;
    for(let i of _this.data.resultList){
      i.selected=false;
      if(i.name==item.name){
        i.selected=true;
        _this.data.resultId=i.id
      }
    }
    this.setData({
      resultList: _this.data.resultList
    })
    _this.suoxuInfo();
  },

  // 判断是否填完所需信息
  suoxuInfo(){
    var _this=this;
    if (_this.data.checked) {
      if (_this.data.brandName != "" && _this.data.shifeiSum != "" && _this.data.companyText != "" && _this.data.recordName != "" && _this.data.resultId != "" && _this.data.date != "") {
        _this.setData({
          disabled:false
        })
      }
    }else{
      _this.setData({
        disabled:false
      })
    }
  },


  // 保存施肥
  isSubmit(){
    var _this=this
    if (!_this.data.checked){
      var TIME = util.formatTimeMonth(new Date);
      this.setData({
        brandId:0,
        recordId:0,
        resultId:0,
        shifeiSum:0,
        companyText:0,
        date: TIME,
      })
    }
    

    // 保存施肥方式
    network.POST({
      httpUrl: "/mobile/manure_record/save",
      openid: _this.data.openid,
      data: {
        collector_id: _this.data.options.userId,
        grow_area_id: _this.data.options.cityId,
        manure_id: _this.data.brandId,
        region_id: _this.data.options.regionId,
        spread_date: _this.data.date,
        spread_method_id: _this.data.recordId,
        spread_num: _this.data.shifeiSum,
        spread_result_id: _this.data.resultId,
        spread_unit: _this.data.companyText,
        stage_id: _this.data.options.jieduanId,
        wx_open_id:_this.data.openid
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (_this.data.options.first =="first"){
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
                    stage_id: _this.data.options.jieduanId
                  },
                  success: function (res) {
                    if (res.data.code == 0) {
                      wx.redirectTo({
                        url: `../acquisitionPhase/acquisitionPhase?qrCode=${qrCode}&stage=${_this.data.options.stageTypeName}&stageId=${_this.data.options.jieduanId}&subId=${_this.data.options.subVarietiesId}`,
                      })
                    }
                    if (res.data.code == 2) {
                      wx.redirectTo({
                        url: `../plantInfo/plantInfo?qrCode=${qrCode}&cityId=${_this.data.options.cityId}&stageId=${_this.data.options.jieduanId}&daqu=${_this.data.options.daqu}&varietiesName=${_this.data.options.varietiesName}&subName=${_this.data.options.subName}&userName=${_this.data.options.userName}&stage=${_this.data.options.stageTypeName}&subId=${_this.data.options.subVarietiesId}&userId=${_this.data.options.userId}&regionId=${_this.data.options.regionId}`,
                      })
                    }
                    if (res.data.code == 1 || res.data.code == 3) {
                      wx.showToast({
                        title: res.data.message,
                        icon: "none",
                        duration: 2000
                      })
                      setTimeout(()=>{
                        wx.navigateBack({
                          delta: 1
                        })
                      },1000)
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
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
          
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
    var _this = this
    app.getLogin().then(function (res) {
      _this.setData({
        openid: res.data.openid,
        options: options
      })

      // 获取施肥品牌
    network.GET({
      httpUrl: "/mobile/manure_type/all",
      openid: _this.data.openid,
      success: function (res) {
        if (res.data.code == 0) {
          var manure = [];
          var subName = [];
          for(let i of res.data.data){
            manure.push({ productName:i.bandTypeName})
          }
          for (let i of res.data.data[0].manureTypeFrontVoList){
            subName.push({
              id:i.id,
              productName: i.productName
            })
          }
          var array=[];
          array.push(manure, subName)
          _this.setData({
            allCities: res.data.data,
            brandList:array,
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

      // 获取施肥方式
      network.GET({
        httpUrl: "/mobile/manure_spread_method/all",
        openid: _this.data.openid,
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

      // 获取施肥结果
      network.GET({
        httpUrl: "/mobile/manure_spread_result/all",
        openid: _this.data.openid,
        success: function (res) {
          if (res.data.code == 0) {
            for(let i of res.data.data){
              i.selected=false
            }
            _this.setData({
              resultList: res.data.data
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