// Bark APP 通知推送Key
const barkKey = '';

const jsName = "zhuanzhuan";
// const $ = API(jsName); // 创建一个名字为weather的脚本。默认为product环境，抑制所有log输出，保持error信息。。
const $ = API(jsName, true); // 打开debug环境，打开所有log输出
// 测试console
$.log(jsName + "脚本加载成功");

const resp = {};
const body = JSON.parse(typeof $response != "undefined" && $response.body || null);
const ua = $request.headers['User-Agent'] || $request.headers['user-agent'];
// resp.body = JSON.stringify(body);

if (typeof $response == "undefined") {
  delete $request.headers["x-revenuecat-etag"]; // prevent 304 issues
  delete $request.headers["X-RevenueCat-ETag"];
  resp.headers = $request.headers;
} else if (body) {
  if (body.respData) {
    $.notify("转转列表解析开始", "总数据量：" + body.respData.totalCount, "当前页码：" + body.respData.index + "，当前页数据量：" + body.respData.count);
    let datas = body.respData.datas;
    var infoIds = [];
    $.log("开始遍历数据");
    datas.forEach(element => {
      let productDetailUrl = element.productDetailUrl;
      let infoId = element.infoId;
      infoIds.push(infoId);
    });
    createPromise(infoIds);
  }
}

function versionfilter(infoIds) {
  var originBody = body;
  var newDatas = [];
  var deviceName = ""
  var systemVersions = [];
  var datas = originBody.respData.datas;
  infoIds.forEach(r => {
    const rBody = r.body;
    const report = rBody.respData.report;
    const params = report.params;
    $.log("解析详情数据");
    params.forEach(element => {
      if (element.key == "系统版本" && /15.4/.test(element.value)) {
        deviceName = element.key
        systemVersions.push(element.value)
        datas.forEach(item => {
          $.log("111element.infoI:" + r.infoId);
          $.log("111item.infoI:" + item.infoId);
          if (r.infoId == item.infoId) {
            newDatas.push(item)
          }
        });

        // $.log("发送通知");
        // let webUrl = "https://m.zhuanzhuan.com/u/streamline_detail/new-goods-detail?infoId=" + r.infoId;
        // $.notify("命中手机", element.key, element.value, { "open-url": webUrl });
      }
    });
  });

  $.log("发送通知");
  $.notify("命中手机，数量：" + newDatas.length, deviceName, systemVersions.toString());

  // 替换数据
  $.log("整合数据量：" + newDatas.length);
  $.log(newDatas);
  originBody.respData.datas = newDatas;
  resp.body = JSON.stringify(originBody);
}

function createPromise(infoIds) {
  var promiseList = [];
  $.log("开始获取详情数据");
  $.log(infoIds);
  infoIds.forEach(infoId => {
    let url = "https://app.zhuanzhuan.com/zzopen/waresshow/moreInfo?infoId=" + infoId
    const p = new Promise((resolve, reject) => {
      $.http.get(url).then(res => {
        const body = JSON.parse(res.body);
        $.log("拿到数据: " + url);
        const r = {
          infoId: infoId,
          body: body
        };
        resolve(r)
      });
    });
    promiseList.push(p);
  });
  Promise.all(promiseList).then(results => {
    $.log("获取详情数据完毕");
    versionfilter(results);

    $.done(resp);

  }).catch((err) => {
    $.log("Promise执行错误:" + err);
  });
}

async function notifyPhone(c = $, title = "", subTitle = "", content = "", options = {}) {
  if (barkKey) {
    await BarkNotify($, barkKey, title, $.msgBody);
  }
}

//Bark APP notify
async function BarkNotify(c, k, t, b) { for (let i = 0; i < 3; i++) { console.log(`🔷Bark notify >> Start push (${i + 1})`); const s = await new Promise((n) => { c.post({ url: 'https://api.day.app/push', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: t, body: b, device_key: k, ext_params: { group: t } }) }, (e, r, d) => r && r.status == 200 ? n(1) : n(d || e)) }); if (s === 1) { console.log('✅Push success!'); break } else { console.log(`❌Push failed! >> ${s.message || s}`) } } };


//https://github.com/Peng-YM/QuanX/tree/master/Tools/OpenAPI
function ENV(){const e="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:"undefined"!=typeof $task,isLoon:"undefined"!=typeof $loon,isSurge:"undefined"!=typeof $httpClient&&"undefined"!=typeof $utils,isBrowser:"undefined"!=typeof document,isNode:"function"==typeof require&&!e,isJSBox:e,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}function HTTP(e={baseURL:""}){const{isQX:t,isLoon:s,isSurge:o,isScriptable:n,isNode:i,isBrowser:r}=ENV(),u=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;const a={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(h=>a[h.toLowerCase()]=(a=>(function(a,h){h="string"==typeof h?{url:h}:h;const d=e.baseURL;d&&!u.test(h.url||"")&&(h.url=d?d+h.url:h.url),h.body&&h.headers&&!h.headers["Content-Type"]&&(h.headers["Content-Type"]="application/x-www-form-urlencoded");const l=(h={...e,...h}).timeout,c={onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{},...h.events};let f,p;if(c.onRequest(a,h),t)f=$task.fetch({method:a,...h});else if(s||o||i)f=new Promise((e,t)=>{(i?require("request"):$httpClient)[a.toLowerCase()](h,(s,o,n)=>{s?t(s):e({statusCode:o.status||o.statusCode,headers:o.headers,body:n})})});else if(n){const e=new Request(h.url);e.method=a,e.headers=h.headers,e.body=h.body,f=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s})}).catch(e=>s(e))})}else r&&(f=new Promise((e,t)=>{fetch(h.url,{method:a,headers:h.headers,body:h.body}).then(e=>e.json()).then(t=>e({statusCode:t.status,headers:t.headers,body:t.data})).catch(t)}));const y=l?new Promise((e,t)=>{p=setTimeout(()=>(c.onTimeout(),t(`${a} URL: ${h.url} exceeds the timeout ${l} ms`)),l)}):null;return(y?Promise.race([y,f]).then(e=>(clearTimeout(p),e)):f).then(e=>c.onResponse(e))})(h,a))),a}function API(e="untitled",t=!1){const{isQX:s,isLoon:o,isSurge:n,isNode:i,isJSBox:r,isScriptable:u}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>{if(i){return{fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(o||n)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),i){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache,null,2);s&&$prefs.setValueForKey(e,this.name),(o||n)&&$persistentStore.write(e,this.name),i&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root,null,2),{flag:"w"},e=>console.log(e)))}write(e,t){if(this.log(`SET ${t}`),-1!==t.indexOf("#")){if(t=t.substr(1),n||o)return $persistentStore.write(e,t);if(s)return $prefs.setValueForKey(e,t);i&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),n||o?$persistentStore.read(e):s?$prefs.valueForKey(e):i?this.root[e]:void 0)}delete(e){if(this.log(`DELETE ${e}`),-1!==e.indexOf("#")){if(e=e.substr(1),n||o)return $persistentStore.write(null,e);if(s)return $prefs.removeValueForKey(e);i&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t="",a="",h={}){const d=h["open-url"],l=h["media-url"];if(s&&$notify(e,t,a,h),n&&$notification.post(e,t,a+`${l?"\n多媒体:"+l:""}`,{url:d}),o){let s={};d&&(s.openUrl=d),l&&(s.mediaUrl=l),"{}"===JSON.stringify(s)?$notification.post(e,t,a):$notification.post(e,t,a,s)}if(i||u){const s=a+(d?`\n点击跳转: ${d}`:"")+(l?`\n多媒体: ${l}`:"");if(r){require("push").schedule({title:e,body:(t?t+"\n":"")+s})}else console.log(`${e}\n${t}\n${s}\n\n`)}}log(e){this.debug&&console.log(`[${this.name}] LOG: ${this.stringify(e)}`)}info(e){console.log(`[${this.name}] INFO: ${this.stringify(e)}`)}error(e){console.log(`[${this.name}] ERROR: ${this.stringify(e)}`)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){s||o||n?$done(e):i&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}stringify(e){if("string"==typeof e||e instanceof String)return e;try{return JSON.stringify(e,null,2)}catch(e){return"[object Object]"}}}(e,t)}