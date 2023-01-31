var headers = {
  'Accept': 'text/html, */*; q=0.01',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
  'Connection': 'keep-alive',
  'Cookie': 'JSESSIONID=hcIH4nOj7eTGEvcAXMNFZ-nhVopTE01TdWrcexWUvvm5Y9XjV29b!-1582810298',
  'Referer': 'https://ggfw.hrss.gd.gov.cn/zjzsh/center.do?nvt=1675169530458',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest',
  'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"'
};

var options = {
  url: 'https://ggfw.hrss.gd.gov.cn/zjzsh/exam/source/logo/logon.do',
  headers: headers
};

$task.fetch(options).then(response => {
  console.log(response.statusCode + "\n\n" + response.body);
  $done();
}, reason => {
  console.log(reason.error);
  $done();
});