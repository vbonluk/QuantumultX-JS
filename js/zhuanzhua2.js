const resp = {};
const body = JSON.parse(typeof $response != "undefined" && $response.body || null);
const ua = $request.headers['User-Agent'] || $request.headers['user-agent'];

if (typeof $response == "undefined") {
	delete $request.headers["x-revenuecat-etag"]; // prevent 304 issues
	delete $request.headers["X-RevenueCat-ETag"];
	resp.headers = $request.headers;
} else if (body) {
	$notify("解析Json", "subtitle2", "message2");
  const report = body.respData.report
  const reportParam = report.reportParam
  const paramDetail = reportParam.paramDetail
  const title = reportParam.title
  const paramInfo = paramDetail.paramInfo
  paramInfo.forEach(element => {
    if (element.paramName == "系统版本") {
      $notify(title, element.paramName, element.paramValue); 
    }
  });
	resp.body = JSON.stringify(obj);
}

$done(resp);


//https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI