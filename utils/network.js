// var port = 'http://47.98.49.34:7083'; //测试环境
// var port = 'http://47.97.43.54:7083'; //测试环境 use
var port = 'https://jinxiang.pano-ai.com'; //正式环境
var requestHandler = {
  httpUrl: '',
  data: {},
  success: function(res) {},
  fail: function(res) {},
  openid: ""
}

//GET请求
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  request('POST', requestHandler)
}



function request(method, requestHandler) {
  var params = requestHandler.data;
  var httpUrl = requestHandler.httpUrl;
  wx.request({
    url: port + httpUrl,
    data: params,
    method: method,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      "openid": requestHandler.openid
    },
    success: function(res) {
      requestHandler.success(res);
    },
    fail: function(res) {
      requestHandler.fail(res);
    }
  })
}
module.exports = {
  GET: GET,
  POST: POST,
  port: port,
}