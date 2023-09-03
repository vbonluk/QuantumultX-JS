const resp = {};
const body = JSON.parse(typeof $response != "undefined" && $response.body || null);
const ua = $request.headers['User-Agent'] || $request.headers['user-agent'];

if (typeof $response == "undefined") {
	delete $request.headers["x-revenuecat-etag"]; // prevent 304 issues
	delete $request.headers["X-RevenueCat-ETag"];
	resp.headers = $request.headers;
} else if (body) {
	// $notify("解析Json", "", "");
  const totalAsset = body.data.content.interfaces.totalAsset
  $notify(totalAsset, "", "");
  body.data.content.interfaces.totalAsset=totalAsset*20000000
	resp.body = JSON.stringify(body);
}

$done(resp);


//https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI
