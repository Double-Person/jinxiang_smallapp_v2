var network = require("../../utils/network.js");
var util = require("../../utils/util.js")

// 图片处理
class LocalPhotoProcessor {
  constructor(canvas_id, page, width, stage_map, part_map) {
    this.canvas_id = canvas_id
    this.page = page
    this.width = width
    this.stage_map = stage_map
    this.part_map = part_map
    this.key_color = ["rgb(255,0,0)", "rgb(128,128,128)", "rgb(0,255,0)", "rgb(0,0,255)"]
  }

  strToColor(text) {
    var color_list = []
    for (var i = 0; i < text.length; i++) {
      var value = 255 - text.charAt(i).charCodeAt()
      color_list.push("rgb(" + value.toString() + ",0," + value + ")")
    }
    return color_list
  }

  
  draw_key_color(ctx, width, height) {
    ctx.setFillStyle(this.key_color[0])
    ctx.fillRect(0, 0, this.width, this.width)
    ctx.setFillStyle(this.key_color[1])
    ctx.fillRect(width - this.width, 0, this.width, this.width)
    ctx.setFillStyle(this.key_color[2])
    ctx.fillRect(0, height - this.width, this.width, this.width)
    ctx.setFillStyle(this.key_color[3])
    ctx.fillRect(width - this.width, height - this.width, this.width, this.width)
  }

  draw_text_array(ctx, text_array) {
    var pos = this.width * 2
    var _this = this
    text_array.forEach(function (text, index) {
      var color_list = _this.strToColor(text)
      color_list.forEach(function (color, index) {
        ctx.setFillStyle(color)
        ctx.fillRect(pos, _this.width, _this.width, _this.width)
        pos += _this.width
      })
      pos += 2 * _this.width
    })
  }

  prefix_integer(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }

  process2(image_path, width, height, plant_id, stage, part, wx_open_id, edition) {
    var res = wx.getSystemInfoSync()
    var destWidth = width
    var destHeight = height
    width = width / res.pixelRatio
    height = height / res.pixelRatio
    const ctx = wx.createCanvasContext(this.canvas_id)
    var that = this
    ctx.drawImage(image_path, 0, 0, width, height)
    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        canvasId: that.canvas_id,
        x: 0,
        y: 0,
        width: width,
        height: height,
        destWidth: destWidth,
        destHeight: destHeight,
        fileType: "jpg",
        quality: 0.8,
        success: function (res) {
          var mgr = wx.getFileSystemManager()
          /*var files = mgr.readdirSync(wx.env.USER_DATA_PATH + "/")
          var text = ""
          files.forEach(function(file, index) {
            text += index + ":" + file + "\n"
          })
          wx.showModal({
            title: 'dd',
            content: text,
          })*/
          var data = mgr.readFile({
            filePath: res.tempFilePath,
            encoding: "binary",
            success: function (res) {
              var data = res.data
              if (data.charCodeAt(data.length - 2) == 0xFF && data.charCodeAt(data.length - 1) == 0XD9) {
                data = data.slice(0, data.length - 2)
                var path = wx.env.USER_DATA_PATH + "/" + Date.parse(new Date()) + ".jpg"
                var info = "JINXIANG " + new String(that.prefix_integer(plant_id, 8)) + " " + that.stage_map[stage] + " " + that.part_map[part] + " " + wx_open_id + " " + edition
                var comment = String.fromCharCode(0XFF) + String.fromCharCode(0XFE) + info + String.fromCharCode(0XFF) + String.fromCharCode(0XD9)
                data = data.concat(comment)
                mgr.writeFile({
                  filePath: path,
                  data: data,
                  encoding: "binary",
                  success: function (e) {
                    wx.saveImageToPhotosAlbum({
                      filePath: path,
                      complete: function (e) {
                        wx.compressImage({
                          src: path,
                          quality: 20,
                          fail: function (e) {
                            wx.log.console(e)
                          },
                          success: function (res) {
                            mgr.unlink({
                              filePath: path
                            })
                            wx.hideToast()
                            //callback(res.tempFilePath)
                          }
                        })

                      }
                    })
                  },
                  fail: function (e) {
                    wx.showModal({
                      title: 'write' + e.errMsg,
                      content: 'write' + e.errMsg,
                    })
                    wx.log.console(e)
                  }
                })
              }
            },
            fail: function (e) {
              wx.showModal({
                title: 'read' + e.errMsg,
                content: 'read' + e.errMsg,
              })
              wx.log.console(e)
            }
          })
        },
        fail(res) {
          console.log(res)
        }
      }, that.page)
    })


  }

  process(image_path, width, height, plant_id, stage, part, wx_open_id, edition) {
    console.log(part)
    var res = wx.getSystemInfoSync()
    var is_android = true
    if (res.platform != "android") {
      is_android = false
    }
    var destWidth = width
    var destHeight = height
    if (!is_android) {
      width = width / res.pixelRatio
      height = height / res.pixelRatio
    }

    setTimeout(() => {
    const ctx = wx.createCanvasContext(this.canvas_id)
    ctx.drawImage(image_path, 0, 0, width, height)
    this.draw_key_color(ctx, width, height)
    this.draw_text_array(ctx, [this.prefix_integer(plant_id, 8), this.stage_map[stage], this.part_map[part], wx_open_id, edition])
    var _this = this
    var path = null

    // ctx.draw(false, function () {
    //   wx.canvasToTempFilePath({
    //     canvasId: _this.canvas_id,
    //     x: 0,
    //     y: 0,
    //     width: width,
    //     height: height,
    //     destHeight: height,
    //     destWidth: width,
      function success(res) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success(res) {
              console.log(res.width)
              console.log(res.height)
            }
          })
          console.log(res.tempFilePath)
          path = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
                wx.hideToast()
            }
          })
        }
      if (true) {
      ctx.draw(false, function () {
        wx.canvasToTempFilePath({
          canvasId: _this.canvas_id,
          x: 0,
          y: 0,
          width: width,
          height: height,
          destHeight: destHeight,
          destWidth: destWidth,
          quality: 0.8,
          success: success,
        fail(res) {
          console.log(res)
        }
      }, _this.page)
    })
      } else {
        ctx.draw(false, function () {
          wx.canvasToTempFilePath({
            canvasId: _this.canvas_id,
            x: 0,
            y: 0,
            width: width,
            height: height,
            quality: 1.0,
            success: success,
            fail(res) {
              console.log(res)
            }
          }, _this.page)
        })
      }
    },1000)
}
}


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
    upload: [], // 上传后的list
    camera: false,
    position: "back",
    src: "../../img/logo.png",
    must: 0,
    noNeed: 0,
    yipaiMust: 0,
    yipaiNoNeed: 0,
    showyipai:0,
    selectPhotograph: true,
    mustList: [],
    noNeedList: [],
    showMustList: [],
    shownoNeedList:[],
    buttom: false,
    canvasWidth:100,
    canvasHeight:100,
    edition:"jxy", //去别版本
    setstorage:"", //设置的缓存数据
    getstorage:"", // 获取的缓存数据
    stageMap:{},
    partMap:{},
    is_android: false,
  },

  clearstorage(){
    wx.clearStorage();
    wx.clearStorageSync();
  },

  gotoShow: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        // 0为选拍 1为必拍
        if (item.isNecessary == 0) {
          _this.data.noNeedList[index].img = res.tempFilePaths[0]
          _this.setData({
            noNeedList: _this.data.noNeedList
          })
        } else {
          _this.data.mustList[index].img = res.tempFilePaths[0]
          _this.setData({
            mustList: _this.data.mustList
          })
        }
        wx.showToast({ title: '处理中', icon: 'loading', mask: true, duration: 60000 })
        var image = res.tempFilePaths[0]
          wx.getImageInfo({
            src: image,
            success(res) {
              var width = res.width
              var height = res.height
              var wholeList = [];
              if (width >= 2048 || height >= 2048) {
                width = width / 2
                height = height / 2
              }

              if (item.isNecessary != 0) {
                wholeList = _this.data.mustList;
              } else {
                wholeList = _this.data.noNeedList;
              }

              _this.setData({ canvasWidth: width, canvasHeight: height, }, () => {
                var info = wx.getSystemInfoSync()
                var is_ios = true
                if (info.platform != "ios") {
                  is_ios = false
                }
                var processor = new LocalPhotoProcessor("photo-canvas", _this, 2, _this.data.stageMap, _this.data.partMap)
                if(is_ios) {
                  processor.process(image, width, height,
                    _this.data.plantInfo.id, _this.data.options.stage,
                    wholeList[index].partName, _this.data.openid, _this.data.edition)
                  _this.data.setstorage += wholeList[index].identification + "_" + wholeList[index].date + "|"
                } else {
                  processor.process2(image, width, height,
                    _this.data.plantInfo.id, _this.data.options.stage,
                    wholeList[index].partName, _this.data.openid, _this.data.edition)
                  _this.data.setstorage += wholeList[index].identification + "_" + wholeList[index].date + "|"
                }
              })
            }
          })
      },
    })
  },

  backed(){
    wx.navigateBack({
      delta: 1
    })
  },

  shooting() {
    var _this=this;
    
    // this.setData({
    //   camera: true,
    //   buttom:false,
    //   shownoNeedList: [],
    //   showMustList: [],
    //   yipaiNoNeed:0,
    //   yipaiMust:0,
    //   showyipai:0
    // })
    // for (let i of _this.data.mustList){
    //   if(i.img==null){
    //     _this.data.showMustList.push(i)
    //   }
    // }
    // for (let i of _this.data.noNeedList) {
    //   if (i.img == null) {
    //     _this.data.shownoNeedList.push(i)
    //   }
    // }

    // _this.setData({
    //   shownoNeedList: _this.data.shownoNeedList,
    //   showMustList: _this.data.showMustList
    // })
    // if (_this.data.showMustList.length==0){
    //   _this.setData({
    //     selectPhotograph:false
    //   })
    // }
    
    wx.setStorageSync('showMustList', JSON.stringify(_this.data.mustList));
    wx.setStorageSync('showNoNeedList', JSON.stringify(_this.data.noNeedList));
    _this.data.options.plantInfoId=_this.data.plantInfo.id;
    var options = JSON.stringify(_this.data.options)
    _this.setData({
      options:_this.data.options
    })
    wx.navigateTo({
      url: `../onPhoto/onPhoto?options=${options}`,
    })
    
  },
  // 跳过
  skip(){
    var _this=this;
    if (_this.data.yipaiNoNeed != _this.data.shownoNeedList.length){
      _this.setData({
        yipaiNoNeed: _this.data.yipaiNoNeed + 1,
        showyipai: _this.data.showyipai + 1
      })
    }else{
      _this.setData({
        buttom:true
      })
      wx.showToast({
        title: "已经没有可拍的了，请点击'拍完了'",
        icon:"none"
      })
    }
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

      _this.ctx = wx.createCameraContext()
      wx.getStorageInfo({
        key: "photostr",
        success: function (res) {
          _this.setData({
            getstorage: wx.getStorageSync('photostr')
          })

        }
      })

     


      network.GET({
        httpUrl: "/mobile/sample_plant/query",
        openid: _this.data.openid,
        data: {
          qr_code_id: _this.data.options.qrCode
        },
        success: function (res) {
          
          if (res.data.code == 0) {
            for (let i of res.data.data) {
              if (i.stageName == _this.data.options.stage) {
                _this.setData({
                  plantInfo:i
                })
              }
            }

            network.GET({
              httpUrl: "/mobile/sample_stage/all_stage_part",
              openid: _this.data.openid,
              data: {
                stage_id: _this.data.options.stageId,
                sub_varieties_id: _this.data.options.subId
              },
              success: function (res) {
                if (res.data.code == 0) {
                  console.log(res)
                  for(let i of res.data.data.stageList){
                    _this.data.stageMap[i.name] = i.description
                  }
                  for (let i of res.data.data.partList) {
                    _this.data.partMap[i.name] = i.description
                  }

                  _this.setData({
                    stageMap: _this.data.stageMap,
                    partMap: _this.data.partMap
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

            network.GET({
              httpUrl: "/mobile/sample_plant_photo/all",
              openid: _this.data.openid,
              data: {
                stage_id: _this.data.options.stageId,
                sample_plant_id: _this.data.plantInfo.id,
                wx_open_id: _this.data.openid
              },
              success: function (res) {
                if (res.data.code == 0) {
                  _this.setData({
                    upload: res.data.data
                  })
                  
                  network.GET({
                    httpUrl: "/mobile/sample_plant_photo/allPart",
                    openid: _this.data.openid,
                    data: {
                      stage_id: _this.data.options.stageId,
                      sub_varieties_id: _this.data.options.subId
                    },
                    success: function (res) {
                      var tempData = res.data.data
                      var temp = [];
                      var date = "";
                      var array = _this.data.getstorage.split("|");
                      if (res.data.code == 0) {
                        for (let i of tempData) {
                          i.identification = `${_this.data.plantInfo.qrCodeId}_${_this.data.plantInfo.stageId}_${i.id}`;

                          if (_this.data.getstorage.lastIndexOf(i.identification) != -1) {
                            for (let j of array) {
                              if (j.indexOf(i.identification) != -1) {
                                temp = j.split("_")
                                date = temp[temp.length - 1]
                              }
                            }
                            i.img = "../../img/default.png";
                            i.date = date
                            if (_this.data.upload.length == 0 ) {
                              i.img = "../../img/default.png";
                              i.date = date
                            } else {
                              for (let j of _this.data.upload) {
                                if (i.partId == j.partId) {
                                  i.img = j.img;
                                  i.date = j.date;
                                }
                              }
                            }

                          }
                        }


                        // 0为选拍 1为必拍
                        let must = [];
                        let noNeed = [];
                        let mustList = [];
                        let noNeedList = [];
                        for (let i of tempData) {
                          if (i.isNecessary == 0) {
                            noNeed.push(i)
                          } else {
                            must.push(i)
                          }
                        }
                        for (let i of must) {
                          if (i.img != null) {
                            mustList.push(i)
                          }
                        }
                        for (let i of noNeed) {
                          if (i.img != null) {
                            noNeedList.push(i)
                          }
                        }
                        if (mustList.length == must.length) {
                          _this.setData({
                            selectPhotograph: false
                          })
                        }
                        if (noNeedList.length == noNeed.length) {
                          _this.setData({
                            buttom: true
                          })
                        }
                        _this.setData({
                          allPartInfo: tempData,
                          must: must.length,
                          noNeed: noNeed.length,
                          mustList: must,
                          noNeedList: noNeed,
                          yipaiMust: mustList.length,
                          yipaiNoNeed: noNeedList.length
                        })
                        // if (_this.data.plantInfo.status == 2) {
                          for (let i of _this.data.upload) {
                            for (let j of _this.data.mustList) {
                              if (i.partId == j.partId) {
                                j.img = i.img;
                                j.date = i.date
                              }
                            }
                            for (let j of _this.data.noNeedList) {
                              if (i.partId == j.partId) {
                                j.img = i.img;
                                j.date = i.date
                              }
                            }
                          }
                          _this.setData({
                            mustList: _this.data.mustList,
                            noNeedList: _this.data.noNeedList,
                            yipaiMust: mustList.length,
                            yipaiNoNeed: noNeedList.length
                          })
                        // }
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
              }
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
    var _this=this;

      if(app.bool){
        _this.setData({
          mustList: JSON.parse(wx.getStorageSync('showMustList')),
          noNeedList: JSON.parse(wx.getStorageSync('showNoNeedList'))
        })
      }
        
    
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
    app.bool=false;
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