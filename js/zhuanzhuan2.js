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
  const params = report.params
  $notify(report.title, params[0].key, params[0].value);
  params.forEach(element => {
    if (element.key == "系统版本") {
      $notify(report.title, element.key, element.value);
    }
  });
	resp.body = JSON.stringify(obj);
}

$done(resp);


//https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI