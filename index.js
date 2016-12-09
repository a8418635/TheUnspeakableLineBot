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

//這段我不懂啦
app.get('/', function(req, res) {
//  res.send(parseInput(req.query.input));
  res.send('Hello?');
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

//port...什麼？反正這段拿掉不會動
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
  //以上這段我不懂，大概是回應訊息
}

/* 




以下





*/
//檢查第一手輸入字串的function
function cInput(rplyToken, inStr) {
  //inStr就是輸入的字串，反正只要處理這一串就對了
  
  if (inStr.match(/\w/)==null) return undefined;//開頭不是純英數就直接省略了，雖然我不確定這樣能不能節省運算啦...
  //如果開頭圍hastur的話，可能是說明文字之類
  else if (inStr.toLowerCase().match(/^hastur/)!=null){
      return hastur_help(inStr);
  }
  //如果開頭為cc則可能是CoC 7th骰
  else if (inStr.toLowerCase().match(/^cc/)!=null){
    return coc7th(inStr);
  }
  //如果輸入字串有小寫d就可能是d66啦基本骰組之類
  else if (inStr.toLowerCase().match(/d/)!=null) {
    return dice_roller(inStr);
  }
  else {
    return undefined;
  }
}

//hastur說明文字
function hastur_help(inStr){
  let help_text="";//說明文字內容
  if (inStr.toLowerCase().match(/^hastur\s?(說明$|help$)/)!=null) {
    help_text= help_text+"無以名狀的擲骰者 版本v1.0\n";
	help_text= help_text+"\n";
	help_text= help_text+"＜擲骰請直接輸入xdy＞\n";
	help_text= help_text+"代表x顆y面骰，支援四則運算與括號。\n";
	help_text= help_text+"＝＝＝＝＝＝＝＝＝\n";
	help_text= help_text+"骰組指令說明，請輸入\n";
	help_text= help_text+"「Hastur 系統名稱」\n";
	help_text= help_text+"系統名稱請見下列\n";
	help_text= help_text+"＝＝＝＝＝＝＝＝＝\n";
	help_text= help_text+"目前支援系統：CoC 7th\n";
	help_text= help_text+"\n";
	help_text= help_text+"\n";
	help_text= help_text+"＝＝＝＝＝＝＝＝＝\n";
	help_text= help_text+"未來預定更新，新增運勢，以及DX、NC的骰組。\n";
	help_text= help_text+"\n";
	help_text= help_text+"此丟骰機器人由悠子根據LarryLo提供的開源製作。\n";
	help_text= help_text+"特別通訊協定：李孟儒\n";
	return help_text;
	//help_text= help_text+"輸入文字\n";
  }
  if (inStr.toLowerCase().match(/^hastur\s?coc\s?7th$/)!=null) {
    help_text= help_text+"＝＝CoC 7th骰組說明＝＝\n";
	help_text= help_text+"\n";
	help_text= help_text+"「cc(x)<=技能值」為一般檢定，\n";
	help_text= help_text+"x可為-2~2，為獎勵與懲罰骰，例：\n";
	help_text= help_text+"cc(2)<=50，cc(-1)<=75。\n";
	help_text= help_text+"\n";
	help_text= help_text+"「cc>技能值」為技能成長檢定，\n";
	help_text= help_text+"輸入cc>將直接計算技能成長骰，\n";
	help_text= help_text+"若成功，連1d10都幫你骰好，\n";
	help_text= help_text+"關於技能成長規則，請參閱規則書。\n";
	help_text= help_text+"忘記說，成長骰還在做。\n";
	help_text= help_text+"\n";
	help_text= help_text+"＝＝＝＝＝＝＝＝＝\n";
	help_text= help_text+"對了，此丟骰機器人現在沒有，\n";
	help_text= help_text+"以後也不會支援CoC 6th，喵哈哈。\n";
    return help_text;
    //help_text= help_text+"輸入文字\n";
  }
}

//所有CoC 7th的骰子（開頭為cc的）
function coc7th(inStr){
  //以下為CoC 7th投骰（基本cc檢定包含獎勵骰，FAR那個全自動槍械骰請容我現在先放棄)
  if (inStr.toLowerCase().match(/^cc(\(-?[12]\))?<=\d{1,}/)!=null && inStr.toLowerCase().split(' ',1)[0].split('<=',2)[1] !=0 && inStr.toLowerCase().split(' ',1)[0].split('<=',2)[1].match(/\./)==null){
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
	  ans=ans+"\n";
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
	//dice_100_a=96;
	
    //以下判定丟骰結果，比對輸入的檢定數字
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
	  else if (dice_100_a >=96 && inStr.split(' ',1)[0].split('<=',2)[1]<100) {
	    //96以上的失敗，根據難度可能大失敗
		ans = ans + ' → 失敗（若要求困難或極限成功為大失敗）';
	    return ans;
	  }
	  ans = ans + ' → 失敗';
	  return ans;
	}
  }
  
  
  //以下為CoC 7th投骰，成長骰的狀況，連成長的數字都幫你骰好
  if (inStr.toLowerCase().match(/cc>\d{1,}/)!=null){
  }

}

//基本骰組的狀況，複數投骰和單次投骰
function dice_roller(inStr){
  //以下這個if是複數投骰
  if (inStr.toLowerCase().match(/\d{1,}d\d{1,}/g) != null && inStr.split(' ',1)[0].match(/\D/)==null && inStr.split(' ',2)[1].match(/\./)==null){
    let dice_mult='';
	let dice_temp='';
    let dice_all =[];
    let dice_sum =[];
	let msg_long=false;
	if (inStr.split(' ',1)[0] > 20) return ("複數丟骰上限為20次，請不要洗頻會被天譴哦（<ゝω・）");
   if (inStr.toLowerCase().split(' ',1)[0].match(/(d1\D)|d1$/)!=null) return ("請不要輸入d1，沒有這種骰子存在，用常數不好嗎 (´；ω；｀)？");
  　if (inStr.toLowerCase().split(' ',2)[1].match(/d0/)!=null) return undefined;
	
	for(let count_roll=1;count_roll<=inStr.split(' ',1)[0];count_roll++){
	  let dice_l=inStr.toLowerCase().split(' ',2)[1];
      let dice_c=inStr.toLowerCase().split(' ',2)[1];
      for(let count=1; count<=inStr.toLowerCase().split(' ',2)[1].match(/\d{1,}d\d{1,}/g).length;count++){
	    dice_temp='';
	    dice_temp=basic_dice(inStr.toLowerCase().split(' ',2)[1].match(/\d{1,}d\d{1,}/g)[count-1]);
	    dice_all[count-1] = '['+dice_temp+']';
	
   	    dice_sum[count-1]=0;
		//如果單組骰子大於20顆則視為太長
	    if (dice_temp.length>=20) msg_long=true;
	    for(let count2 = 1 ;count2<=dice_temp.length; count2++){
		  //如果骰子結果大於100則視為太長
	      if (dice_temp[count2-1]>100) msg_long=true;
          dice_sum[count-1] = dice_temp[count2-1]+dice_sum[count-1];
  	    }
	    dice_c=dice_c.replace((/\d{1,}d\d{1,}/),dice_sum[count-1]);
	    dice_l=dice_l.replace((/\d{1,}d\d{1,}/),dice_sum[count-1]+dice_all[count-1]);
	  }
	  if (msg_long==true){
	    dice_mult = dice_mult+('第'+count_roll+'次投骰：= '+eval(dice_c)+'\n')
	  }
	  else{
	    dice_mult = dice_mult+('第'+count_roll+'次投骰： '+dice_l+' = '+eval(dice_c)+'\n')
	  }
	  
    }
	if (msg_long==true){
	  return ('基本骰組（複數投骰，骰數過長僅顯示結果）：\n'+'\n'+dice_mult);
	}
	else{
	  return ('基本骰組（複數投骰）：\n'+'\n'+dice_mult);
	}
  }
  
  //以下這個if是單次基本投骰
  if (inStr.toLowerCase().split(' ',1)[0].match(/\d{1,}d\d{1,}/g) != null && inStr.split(' ',1)[0].match(/\.|\^|#/)==null){
    let dice_l=inStr.toLowerCase().split(' ',1)[0]; //顯示用的骰子結果
    let dice_c=inStr.toLowerCase().split(' ',1)[0]; //整串計算用的骰子結果
  
    if (inStr.toLowerCase().split(' ',1)[0].match(/(d1\D)|d1$/)!=null) return ("請不要輸入d1，沒有這種骰子存在，用常數不好嗎 (´；ω；｀)？");
  　if (inStr.toLowerCase().split(' ',1)[0].match(/d0/)!=null) return undefined;
  
    let dice_temp='';　//對啦對啦我知道用temp當變數很沒良心但是請不要提醒我QQ
    let dice_all =[]; //每組骰子的內容(像2d6這樣叫做一組)
    let dice_sum =[]; //每組骰子的總和(像2d6骰出2~12這叫做總合)
	let msg_long=false;
    for(let count=1; count<=inStr.toLowerCase().split(' ',1)[0].match(/\d{1,}d\d{1,}/g).length;count++){
	  dice_temp=basic_dice(inStr.toLowerCase().split(' ',1)[0].match(/\d{1,}d\d{1,}/g)[count-1]);
	  dice_all[count-1] = '['+dice_temp+']';
	
   	  dice_sum[count-1]=0;
	  //如果單組骰子大於20顆則視為太長
	  if (dice_temp.length>=20) msg_long=true;
	  for(let count2 = 1 ;count2<=dice_temp.length; count2++){
	    //如果骰子結果大於100則視為太長
	    if (dice_temp[count2-1]>100) msg_long=true;
        dice_sum[count-1] = dice_temp[count2-1]+dice_sum[count-1];
  	  }
	  dice_c=dice_c.replace((/\d{1,}d\d{1,}/),dice_sum[count-1]);
	  dice_l=dice_l.replace((/\d{1,}d\d{1,}/),dice_sum[count-1]+dice_all[count-1]);
	
    }
	//判斷回應訊息是不是太長
	if (msg_long==true) {
	  return ('基本骰組：'+eval(dice_c)+'（骰數過多或過面數大，僅顯示結果）');
	}
	else {
      return ('基本骰組：'+dice_l+' = '+eval(dice_c));
    } 
  }
  
  return undefined;
}


  //基本骰子的function(xdy這種，每顆骰子都獨立結果回傳陣列)，我其實不知道為什麼我要把這獨立拉出來做，不過就這樣吧
function basic_dice(bdice){
    let dice_group = [];
    for(let count = 1 ; count<=bdice.split("d",2)[0] ; count++){
	    dice_group[count-1] = Math.floor((Math.random()*bdice.split("d",2)[1])+1);
	  }
    return dice_group;
}
