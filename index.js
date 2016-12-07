var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');  
var app = express();

var jsonParser = bodyParser.json();

var options = {
  host: 'api.line.me',
  port: 443,
  path: '/v2/bot/message/reply',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    //一號
    //'Authorization': 'Bearer FxkFy3W6dgqm2loOZly4vmChpfbQRa2ZZvtn7qrC8EfIV0xZWCGqA2DL6yTOJ3DH/qwU+738SSR3x+V+NtERsSJnkjb2RBAtA0VUCKa3WxnerpcO9hl91Zqqz5dCazB0pLFBfLWbNZ6rVwfBGAG66gdB04t89/1O/w1cDnyilFU='
    //二號
    'Authorization': 'Bearer iX0hzYSVtLGdDkAuRPmGhCkr08f4+66tYu01HQTLq0pYMcBlbILoJwpxrn4Up9vPI7V9WrpwTKWKQ0ZUtGeUTFXXrIpshKQZEC+6RX6iWGIAJ68c5u8nHO2v4juke2q8oLVqU5uV4WotQER9uMZHmAdB04t89/1O/w1cDnyilFU='
  }
}
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
//這段我不懂啦
app.get('/', function(req, res) {
//  res.send(parseInput(req.query.input));
  res.send('Hello?');
//哈囉什麼？網頁顯示的東西嗎
});

//app.開頭的因為我都看不懂所以不要亂動，這段看起來是收訊息什麼的
app.post('/', jsonParser, function(req, res) {
  let event = req.body.events[0];
  let type = event.type;
  let msgType = event.message.type;
  let msg = event.message.text;
  let rplyToken = event.replyToken;

  let rplyVal = null;
  //所以下面這行的msg是輸入的訊息
  console.log('收到輸入訊息:'+msg);
  if (type == 'message' && msgType == 'text') {
    try {
      console.log('跑到try這邊，呼叫cInput');
      rplyVal = cInput(rplyToken, msg); 
    } 
    catch(e) {
      //rplyVal = randomReply();
      console.log('總之先隨便擺個跑到這邊的訊息，catch error');
    }
  }
  
  if (rplyVal) {
    replyMsgToLine(rplyToken, rplyVal);
    console.log('回應訊息:'+rplyVal);
  } else {
    console.log('傳回undefined，不回應訊息'); 
  }

  res.send('ok');
});

//port什麼？反正拿掉不會動
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//回傳訊息什麼的吧
function replyMsgToLine(rplyToken, rplyVal) {
  console.log('有跑到回傳的function');
  let rplyObj = {
    replyToken: rplyToken,
    messages: [
      {
        type: "text",
        text: rplyVal
      }
    ]
  }
  //以下這段我不懂，但大概是回應訊息
  let rplyJson = JSON.stringify(rplyObj); 
  
  var request = https.request(options, function(response) {
    console.log('Status: ' + response.statusCode);
    console.log('Headers: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function(body) {
      console.log(body); 
    });
  });
  request.on('error', function(e) {
    console.log('Request error: ' + e.message);
  })
  request.end(rplyJson);
  //以上這段我不懂，大概是回應訊息ㄅ
}

/* 




以下





*/
//檢查輸入資料什麼的吧，要動應該就是主要是動這邊了，我要用死大學生寫法全都塞在一個function裡面
function cInput(rplyToken, inStr) {
  console.log('cInput開始');
  //inStr就是輸入的字串，反正只要處理這一串就對了
  
  //字串先處理基本的
  //總之要先檢查字串內容包含加號、d、或開頭為cc之類...該怎麼做呢？
  //總之先把字串搬出來全小寫
  let final_ans='仍在測試中';
  
  let dice_l=inStr.toLowerCase().split(' ',1)[0];
  let dice_c=inStr.toLowerCase().split(' ',1)[0];
  
  let dice_temp='';
  let dice_all =[];
  let dice_sum =[];
  for(let count=1; count<=inStr.toLowerCase().split(' ',1)[0].match(/\d{1,}d\d{1,}/g).length;count++){
	dice_temp=basic_dice(inStr.toLowerCase().split(' ',1)[0].match(/\d{1,}d\d{1,}/g)[count-1]);
	dice_all[count-1] = '['+dice_temp+']';
	
	dice_sum[count-1]=0;
	  for(let count2 = 1 ;count2<=dice_temp.length; count2++){
            dice_sum[count-1] = dice_temp[count2-1]+dice_sum[count-1];
	  }
	dice_c=dice_c.replace((/\d{1,}d\d{1,}/),dice_sum[count-1]);
	dice_l=dice_l.replace((/\d{1,}d\d{1,}/),dice_sum[count-1]+dice_all[count-1]);
	
  }
  return ('基本骰組：'+dice_l+' = '+eval(dice_c));
}

  //基本骰子的function(xdy這種，每顆骰子都獨立結果回傳陣列)
  function basic_dice(bdice){
    let dice_group = [];
    for(let count = 1 ; count<=bdice.split("d",2)[0] ; count++){
	    dice_group[count-1] = Math.floor((Math.random()*bdice.split("d",2)[1])+1);
	  }
    return dice_group;
  }
  
