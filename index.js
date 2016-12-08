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
    //輸入那個什麼，Channel Access Token
    'Authorization': 'Bearer [LineAuthorization]'
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
  
  let help_text="";
  if (inStr.toLowerCase().match(/^hastur\s?說明$/)!=null) {
    help_text= help_text+"無以名狀的擲骰者 版本v1.0\n";
	help_text= help_text+"\n";
	help_text= help_text+"擲骰請直接輸入xdy，代表x顆y面骰，支援四則運算\n";
	help_text= help_text+"骰組指令說明，請輸入「Hastur 系統名稱」，系統名稱請見下列\n";
	help_text= help_text+"目前支援系統：CoC 7th\n";
	help_text= help_text+"\n";
	help_text= help_text+"\n";
	help_text= help_text+"未來預定更新，新增運勢，以及DX、NC的骰組。\n";
	help_text= help_text+"\n";
	help_text= help_text+"此丟骰機器人由悠子及Roc Teseng的好友製作，特別感謝：李孟儒\n";
	help_text= "";
	//help_text= help_text+"輸入文字\n";
	return help_text;
  }
  if (inStr.toLowerCase().match(/^hastur\s?coc\s?7th$/)!=null) {
    help_text= help_text+"CoC 7th骰組說明：\n";
	help_text= help_text+"輸入文字\n";
	help_text= help_text+"請直接輸入cc<=檢定數字\n";
	help_text= help_text+"cc()內可輸入獎勵與懲罰骰，例：cc(2)為2獎勵骰，cc(-1)為1懲罰骰。\n";
	help_text= help_text+"輸入文字\n";
	help_text= help_text+"輸入cc>將直接計算技能成長骰，連1d10都幫你骰好，詳細規則請參閱規則書。\n";
	help_text= help_text+"忘記說，成長骰還在做。\n";
	help_text= help_text+"\n";
	help_text= help_text+"對了，此丟骰機器人現在沒有，以後也不會支援CoC 6th，喵哈哈。\n";
    return help_text;
    //help_text= help_text+"輸入文字\n";
  }
  
  //以下為CoC 7th投骰（基本cc檢定包含獎勵骰，FAR那個全自動槍械骰請容我現在先放棄)
  if (inStr.toLowerCase().match(/^cc(\(-?[12]\))?<=\d{1,}/)!=null){
    let dice_100_a =[]; //丟骰最終值
	let dice_1_a = Math.floor((Math.random()*10)); //丟骰個位數
	let dice_bp=[];  //紀錄十位數的獎懲骰
	let ans='克蘇魯的呼喚7th：(1D100<='+inStr.split(' ',1)[0].split('<=',2)[1]+') '; //最終要回傳的字串

	//迴圈丟骰結果，獎勵骰0只跑一次，獎勵懲罰骰12就跑+1+2次
	  for (let count=0;count<=inStr.split(' ',1)[0].split('<=',2)[0].match(/[12]/);count++){
	    dice_bp[count]=(Math.floor((Math.random()*10+1)))*10;
		if (dice_bp[count]==100) dice_bp[count]=0;
	    dice_100_a[count]=dice_bp[count]+dice_1_a;
	    if (dice_100_a[count]==0) dice_100_a[count]=100;
	  }
	  
	if (inStr.split(' ',1)[0].split('<=',2)[0].match(/[12]/) != null) {
	  ans=ans+'初始結果 → '+dice_100_a[0];
	  ans=ans+"\n<br>";
	  ans=ans+"→ 十位數加骰為"+dice_bp[1];
	  if (inStr.split(' ',1)[0].split('<=',2)[0].match(/[2]/) != null) ans=ans+"、"+dice_bp[2];
	}
	else {
	  ans=ans+'→ '+dice_100_a[0];
	}
	
	if (inStr.split(' ',1)[0].split('<=',2)[0].match(/-/)!=null){
	  dice_100_a=Math.max(...dice_100_a);
	  ans = ans + "，懲罰骰取高 → "+'最終值('+dice_100_a+')';
	}
	else {
	  dice_100_a=Math.min(...dice_100_a);
	  if (inStr.split(' ',1)[0].split('<=',2)[0].match(/[12]/) != null) ans = ans + "，獎勵骰取低 → "+'最終值('+dice_100_a+')';
	  //else ans = ans +'最終值('+dice_100_a+')'
	}
	
	//暫時輸入骰數
	//dice_100_a=1;

	if (dice_100_a == 1){
	  //大成功
	  ans = ans + ' → ＼大★成★功／';
	  return ans;
	}
	else if (dice_100_a == 100){
	  //大失敗，00為固定大失敗
	  ans = ans + ' → 大失敗，すばらしく運がないな、君は。';
	  return ans;
	}
	else if (dice_100_a <= inStr.split(' ',1)[0].split('<=',2)[1]/5){
	  //極限成功
	  ans = ans + ' → 極限成功';
	  return ans;
	}
	else if (dice_100_a <= inStr.split(' ',1)[0].split('<=',2)[1]/2){
	  //困難成功
	  if (dice_100_a >=96 && inStr.split(' ',1)[0].split('<=',2)[1]<250) {
	    //96以上的困難成功，根據難度可能大失敗
		ans = ans + ' → 困難成功（若要求極限成功為大失敗）';
		return ans;
	  }
	  ans = ans + ' → 困難成功';
	  return ans;
	}
	else if (dice_100_a <= inStr.split(' ',1)[0].split('<=',2)[1]){
	  //一般成功
	  if (dice_100_a >=96 && inStr.split(' ',1)[0].split('<=',2)[1]<100) {
	    //96以上的一般成功，根據難度可能大失敗
		ans = ans + ' → 一般成功（若要求困難或極限成功為大失敗）';
	    return ans;
	  }
	  else if (dice_100_a >=96 && inStr.split(' ',1)[0].split('<=',2)[1]<250) {
	    //96以上的一般成功，根據難度可能大失敗
		ans = ans + ' → 一般成功（若要求極限成功為大失敗）';
	    return ans;
	  }
	  ans = ans + ' → 一般成功';
	  return ans;
	}
	else if (dice_100_a > inStr.split(' ',1)[0].split('<=',2)[1]){
	  //失敗
	  if (dice_100_a >=96 && inStr.split(' ',1)[0].split('<=',2)[1]<50) {
	    //96以上的失敗，根據難度可能大失敗
		ans = ans + ' → 大失敗，すばらしく運がないな、君は。';
	    return ans;
	  }
	  ans = ans + ' → 失敗';
	  return ans;
	}
  }
  
  
  //以下為CoC 7th投骰，成長骰的狀況，連成長的數字都幫你骰好
  if (inStr.toLowerCase().match(/cc>\d{1,}/)!=null){
  }
  
  
  //以下這個if是複數投骰
  if (inStr.toLowerCase().match(/\d{1,}d\d{1,}/g) != null && inStr.split(' ',1)[0].match(/\D/)==null && inStr.split(' ',2)[1].match(/\./)==null){
    let dice_mult='';
	let dice_temp='';
    let dice_all =[];
    let dice_sum =[];
	for(let count_roll=1;count_roll<=inStr.split(' ',1)[0];count_roll++){
	  let dice_l=inStr.toLowerCase().split(' ',2)[1];
      let dice_c=inStr.toLowerCase().split(' ',2)[1];
      for(let count=1; count<=inStr.toLowerCase().split(' ',2)[1].match(/\d{1,}d\d{1,}/g).length;count++){
	    dice_temp='';
	    dice_temp=basic_dice(inStr.toLowerCase().split(' ',2)[1].match(/\d{1,}d\d{1,}/g)[count-1]);
	    dice_all[count-1] = '['+dice_temp+']';
	
   	    dice_sum[count-1]=0;
	      for(let count2 = 1 ;count2<=dice_temp.length; count2++){
            dice_sum[count-1] = dice_temp[count2-1]+dice_sum[count-1];
  	      }
	    dice_c=dice_c.replace((/\d{1,}d\d{1,}/),dice_sum[count-1]);
	    dice_l=dice_l.replace((/\d{1,}d\d{1,}/),dice_sum[count-1]+dice_all[count-1]);
	  }
	  dice_mult = dice_mult+('第'+count_roll+'次投骰： '+dice_l+' = '+eval(dice_c)+'\n')
	  
    }
	return ('基本骰組（複數投骰）：\n'+'\n'+dice_mult);
  }
  
  //以下這個if是單次基本投骰
  if (inStr.toLowerCase().split(' ',1)[0].match(/\d{1,}d\d{1,}/g) != null && inStr.split(' ',1)[0].match(/\./)==null){
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
  
  //計算骰子結束
}

  //基本骰子的function(xdy這種，每顆骰子都獨立結果回傳陣列)
  function basic_dice(bdice){
    let dice_group = [];
    for(let count = 1 ; count<=bdice.split("d",2)[0] ; count++){
	    dice_group[count-1] = Math.floor((Math.random()*bdice.split("d",2)[1])+1);
	  }
    return dice_group;
  }
  
