// var obj = JSON.parse($response.body);
// $notify("test", "subtitle", "message");
// $done({body: JSON.stringify(obj)});

// $.notify('吾爱破解', ``, `未填写/未获取Cookie!`);
// var responseBody = $response.body;
// var url = $request.usl;
// if (responseBody) {
//   $.notify("test22");
//   var obj = JSON.parse(responseBody);
//   if (/\/zzopen\/ypmall\/listData/.test(url) && obj.respData) {
//     let originList = obj.respData.datas;
//     $.notify("test");
//   }
//   $done({ body: JSON.stringify(obj) });
// } else {
//   $done({});
// }

const resp = {};
const obj = JSON.parse(typeof $response != "undefined" && $response.body || null);
const ua = $request.headers['User-Agent'] || $request.headers['user-agent'];

if (typeof $response == "undefined") {
	delete $request.headers["x-revenuecat-etag"]; // prevent 304 issues
	delete $request.headers["X-RevenueCat-ETag"];
	resp.headers = $request.headers;
} else if (obj) {
	$notify("解析Json", "subtitle2", "message2");
  if (obj.respData) {
    let datas = obj.respData.datas;
    var newData = []
    // datas.forEach(element => {
    //   let productDetailUrl = element.productDetailUrl
    //   let infoId = element.infoId
    //   let detailUrl = "https://app.zhuanzhuan.com/zzopen/waresshow/moreInfo?infoId=" + infoId
    //   $notify("解析成功", "url", detailUrl);
    //   const myRequest = {
    //     url: detailUrl,
    //     method: "GET",
    //   };
    //   $task.fetch(myRequest).then(res => {
    //     const detailBody = res.body
    //     const report = detailBody.respData.report
    //     const reportParam = report.reportParam
    //     const paramDetail = reportParam.paramDetail
    //     const title = reportParam.title
    //     $notify("test3", "title", title);
    //   }, reason => {
    //     $notify("获取详情失败", "获取详情失败", "获取详情失败");
    //   });
    // });
  }
	resp.body = JSON.stringify(obj);
}

$done(resp);


//https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI