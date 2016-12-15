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
    //四號機
    'Authorization': 'Bearer [LineAuthorization]'
  }
}
app.set('port', (process.env.PORT || 5000));

//這段我不懂
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
  //下面這行的msg是輸入的字串
  console.log('收到輸入訊息：'+msg);
  if (type == 'message' && msgType == 'text') {
    try {
      //console.log('跑到try這邊，呼叫cInput');
      rplyVal = cInput(rplyToken, msg); 
    } 
    catch(e) {
      //rplyVal = randomReply();
      //console.log('總之先隨便擺個跑到這邊的訊息，catch error');
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

//port什麼的...反正這段拿掉不會動
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//回傳訊息什麼的
function replyMsgToLine(rplyToken, rplyVal) {
  //console.log('有跑到回傳的function');
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
    //onsole.log('Status: ' + response.statusCode);
    //console.log('Headers: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function(body) {
      //console.log(body); 
    });
  });
  request.on('error', function(e) {
    //console.log('Request error: ' + e.message);
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
  
  let str_back=''; //回傳字串
  if (inStr.match(/^\w/)==null && inStr.match(/運勢/)==null) return undefined;//開頭不是純英數就直接省略了，雖然我不確定這樣能不能節省運算啦...
  //如果開頭圍hastur的話，可能是說明文字之類
  else if (inStr.toLowerCase().match(/^hastur/)!=null){
      return hastur_help(inStr);
  }
  //如果開頭為cc則可能是CoC 7th骰
  else if (inStr.toLowerCase().match(/^cc/)!=null){
    str_back=coc7th(inStr);
	if (str_back != undefined) return str_back;
  }
  //如果開頭是choice的話就是choice
  else if (inStr.toLowerCase().match(/^choice/)!=null){
    str_back=choice(inStr);
	if (str_back != undefined) return str_back;
  }
  //如果輸入字串有小寫d就可能是d66啦基本骰組之類
  else if (inStr.toLowerCase().match(/d/)!=null) {
    if (inStr.toLowerCase().split(' ',1)[0].match(/^d66s?$/)!=null){
	  str_back=d66(inStr);
	  if (str_back != undefined) return str_back;
	}
    str_back=dice_roller(inStr);
	if (str_back != undefined) return str_back;
  }
  //來個運勢 
  else if (inStr.match(/運勢/)!=null){
    return fortune(inStr)
  }
  else {
    return undefined;
  }
}

//hastur說明文字
function hastur_help(inStr){
  let help_text="";//說明文字內容
  if (inStr.toLowerCase().match(/^hastur\s?(說明$|help$)/)!=null) {
    help_text= help_text+"無以名狀的擲骰者 版本v1.04\n";
	help_text= help_text+"\n";
	help_text= help_text+"＜擲骰請直接輸入xdy＞\n";
	help_text= help_text+"代表x顆y面骰，支援四則運算與括號。\n";
	help_text= help_text+"\n";
	help_text= help_text+"其他基本骰子功能，請輸入\n";
	help_text= help_text+"「Hastur Dice」或「Hastur 骰子」\n";
	help_text= help_text+"\n";
	help_text= help_text+"＝＝＝＝＝＝＝＝＝\n";
	help_text= help_text+"骰組指令說明，請輸入\n";
	help_text= help_text+"「Hastur 系統名稱」\n";
	help_text= help_text+"系統名稱請見下列\n";
	help_text= help_text+"＝＝＝＝＝＝＝＝＝\n";
	help_text= help_text+"目前支援系統：CoC 7th\n";
	help_text= help_text+"\n";
	help_text= help_text+"\n";
	help_text= help_text+"＝＝＝＝＝＝＝＝＝\n";
	help_text= help_text+"未來預定更新，DX、NC的骰組。\n";
	help_text= help_text+"\n";
	help_text= help_text+"此丟骰機器人由悠子根據LarryLo提供的開源製作。\n";
	help_text= help_text+"若發現任何Bug或建議請用此e-mail聯繫悠子：\n";	
	help_text= help_text+"hasut_dice_roller@mailhero.io\n";
	help_text= help_text+"\n";
	help_text= help_text+"特別通訊協定：李孟儒\n";
	return help_text;
	//help_text= help_text+"輸入文字\n";
  }
  if (inStr.toLowerCase().match(/^hastur\s?(骰子$|dice$)/)!=null) {
    help_text= help_text+"＝＝基本骰組說明＝＝\n";
	help_text= help_text+"進行一般xdy丟骰時，\n";
 	help_text= help_text+"前綴數字可複數丟骰，如7 3d6，\n";
	help_text= help_text+"代表丟七次3d6。\n";
	help_text= help_text+"\n";
  	help_text= help_text+"＜輸入Choice[x,y,z]＞\n";
	help_text= help_text+"隨機選擇x,y,z任一選項。\n";
	help_text= help_text+"\n";
  	help_text= help_text+"＜輸入d66（或d66s）＞\n";
	help_text= help_text+"投擲d66骰，為兩顆六面骰順序排列。\n";
	help_text= help_text+"d66s則以此前提，小者固定在前。\n";
	return help_text;
  }
  if (inStr.toLowerCase().match(/^hastur\s?coc\s?7th$/)!=null) {
    help_text= help_text+"＝＝CoC 7th骰組說明＝＝\n";
	help_text= help_text+"\n";
	help_text= help_text+"「cc(x)<=技能值」為一般檢定，\n";
	help_text= help_text+"x可為-2~2，為獎勵與懲罰骰，例：\n";
	help_text= help_text+"cc(2)<=50，cc(-1)<=75。\n";
	help_text= help_text+"將cc改為ccy，為悠子房規檢定。\n";
	help_text= help_text+"\n";
	help_text= help_text+"「cc>技能值」為技能成長檢定，\n";
	help_text= help_text+"輸入cc>將直接計算技能成長骰，\n";
	help_text= help_text+"若成功，連1d10都幫你骰好，\n";
	help_text= help_text+"關於技能成長規則，請參閱規則書。\n";
	help_text= help_text+"\n";
	help_text= help_text+"「cc crt 年齡」為CoC 7th創角骰，\n";
	help_text= help_text+"一步到位式的連年齡調整都骰好。\n";
	help_text= help_text+"空格位置不能錯，年齡須介於15~90。\n";
	help_text= help_text+"將cc改為ccy，無須輸入年齡，\n";
	help_text= help_text+"為悠子房規創角骰。\n";
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
    let dice_100_a =[]; 
	let dice_1_a = Math.floor((Math.random()*10)); 
	let dice_bp=[]; 
	let ans='克蘇魯的呼喚7th：\n(1D100<='+inStr.split(' ',1)[0].split('<=',2)[1]+') ';

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
  
  //房規丟骰ccy
  if (inStr.toLowerCase().match(/^ccy(\(-?[12]\))?<=\d{1,}/)!=null && inStr.toLowerCase().split(' ',1)[0].split('<=',2)[1] !=0 && inStr.toLowerCase().split(' ',1)[0].split('<=',2)[1].match(/\./)==null){
    let dice_100_a =[]; //丟骰最終值
	let dice_1_a = Math.floor((Math.random()*10)); //丟骰個位數
	let dice_bp=[];  //紀錄十位數的獎懲骰
	let ans='克蘇魯的呼喚7th（悠子房規）：\n(1D100<='+inStr.split(' ',1)[0].split('<=',2)[1]+') '; //最終要回傳的字串

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
	//dice_100_a=98;
	
    //以下判定丟骰結果，比對輸入的檢定數字
	if (dice_100_a == 1){
	  //01大成功
	  ans = ans + ' → ＼大★成★功／';
	  return ans;
	}
	else if (dice_100_a <= 5 && inStr.split(' ',1)[0].split('<=',2)[1]>=25){
	  //01~05的大成功，技能值須在25以上
	  ans = ans + ' → ＼大★成★功／';
	  return ans;
	}
	else if (dice_100_a <= inStr.split(' ',1)[0].split('<=',2)[1]/5){
	  //極限成功
	  ans = ans + ' → 極限成功';
	  return ans;
	}
	else if (dice_100_a <= inStr.split(' ',1)[0].split('<=',2)[1]/2){
	  //困難成功
	  ans = ans + ' → 困難成功';
	  return ans;
	}
	else if (dice_100_a <= inStr.split(' ',1)[0].split('<=',2)[1]){
	  //一般成功
	  ans = ans + ' → 一般成功';
	  return ans;
	}
	else if (dice_100_a ==100){
	  //大失敗，00為固定大失敗
	  ans = ans + ' → 大失敗，すばらしく運がないな、君は。';
	  return ans;
	}
	else if (dice_100_a >=96 && dice_100_a > inStr.split(' ',1)[0].split('<=',2)[1]){
	  //大失敗，96以上且大於技能值為大失敗
	  ans = ans + ' → 大失敗，すばらしく運がないな、君は。';
	  return ans;
	}
	else {
	  //就是失敗
	  ans = ans + ' → 失敗';
	  return ans;
	}
  }
  
  
  //以下為CoC 7th投骰，成長骰
  else if (inStr.toLowerCase().match(/cc>\d{1,}\s?/)!=null && inStr.toLowerCase().split(' ',1)[0].split('>',2)[1].match(/\.|\^|\$|\\|\-|\+|\?|\*|#|!|%|&|\(|\)/)==null){
	let dice_100_a = Math.floor((Math.random()*100+1));
	if (dice_100_a>=96){
	  ans = '克蘇魯的呼喚7th（成長骰）：\n(1D100>'+inStr.split(' ',1)[0].split('>',2)[1]+') → '+dice_100_a+' → 大於96必定成長\n該技能成長：1d10 → '+Math.floor((Math.random()*10+1))+' 點技能點數。';
	  return ans;
	}
	else if (inStr.split(' ',1)[0].split('>',2)[1]<dice_100_a){
	  ans = '克蘇魯的呼喚7th（成長骰）：\n(1D100>'+inStr.split(' ',1)[0].split('>',2)[1]+') → '+dice_100_a+' → 成功\n該技能成長：1d10 → '+Math.floor((Math.random()*10+1))+' 點技能點數。';
	  return ans;
	}
	else{
	  ans = '克蘇魯的呼喚7th（成長骰）：\n(1D100>'+inStr.split(' ',1)[0].split('>',2)[1]+') → '+dice_100_a+' → 失敗\n該技能無成長';
	  return ans;
	}
  }
  
  //悠子自家創角
  else if (inStr.toLowerCase().match(/^ccy\scrt$/) != null){
    let abl=[];
    ans='＝＝CoC 7th創角骰（悠子房規）＝＝\n\n';
	ans=ans+'七次(3d6)*5，自選其中五個結果任意分配於STR、CON、DEX、APP、POW。\n'
	for(let count=1;count<=7;count++){
	  abl[0]=Math.floor((Math.random()*6+1));
	  abl[1]=Math.floor((Math.random()*6+1));
	  abl[2]=Math.floor((Math.random()*6+1));
	  ans=ans+'第'+count+'次投骰 → ['+abl+']*5 →'+(abl[0]+abl[1]+abl[2])*5+'\n';
	}
	ans=ans+'\n' 
	abl=[];
	ans=ans+'四次(2d6+6)*5，自選其中三個結果任意分配於SIZ、INT、EDU。\n'
    for(let count=1;count<=4;count++){
	  abl[0]=Math.floor((Math.random()*6+1));
	  abl[1]=Math.floor((Math.random()*6+1));
	  ans=ans+'第'+count+'次投骰 → (['+abl+']+6)*5 →'+(abl[0]+abl[1]+6)*5+'\n';
	}
	ans=ans+'\n' 
	ans=ans+'兩次(3d6)*5，自選其一填入LUK。\n'
	for(let count=1;count<=2;count++){
	  abl[0]=Math.floor((Math.random()*6+1));
	  abl[1]=Math.floor((Math.random()*6+1));
	  abl[2]=Math.floor((Math.random()*6+1));
	  ans=ans+'第'+count+'次投骰 → ['+abl+']*5 →'+(abl[0]+abl[1]+abl[2])*5+'\n';
	}
	return ans;
  }
  
  //以下為CoC 7th創角骰
  else if (inStr.toLowerCase().match(/^cc\scrt\s\d{1,2}$/) != null){
	let abl=[];
	let abl_temp='';
	ans='';
	if(inStr.split(' ',3)[2]<15){
	  return '嗯……不滿15歲的調查員，你認真的嗎？(ﾟдﾟ)\n雖然蘿莉正太超棒的，\n但真要創的話，還請和你家KP討論一下哦。'
	}
	else if(inStr.split(' ',3)[2]>=90){
	  return '欸……年紀這麼大應該要退休了吧？(´・ω・`)\n如果要建立年紀大於90歲的調查員，請和你家KP進行討論哦。'
	}
	ans=ans+'＝＝CoC 7th創角擲骰＝＝\n\n';
	if (inStr.split(' ',3)[2]<=19) ans=ans+'15至19歲的調查員，STR、SIZ、EDU各減去5點，\nLUK將可擲骰兩次，擇優作為LUK屬性。\n\n';
	else if (inStr.split(' ',3)[2]<=39) ans=ans+'20至39歲的調查員，進行一次EDU的增強檢定。\n\n';
	else if (inStr.split(' ',3)[2]<=49) ans=ans+'40至49歲的調查員，進行二次EDU的增強檢定。\nAPP減少5點。\nSTR、DEX、CON三者合計共減少5點（請人工計算。）\n\n';
	else if (inStr.split(' ',3)[2]<=59) ans=ans+'50至59歲的調查員，進行三次EDU的增強檢定。\nAPP減少10點。\nSTR、DEX、CON三者合計共減少10點（請人工計算。）\n\n';
	else if (inStr.split(' ',3)[2]<=69) ans=ans+'60至69歲的調查員，進行四次EDU的增強檢定。\nAPP減少15點。\nSTR、DEX、CON三者合計共減少20點（請人工計算。）\n\n';
	else if (inStr.split(' ',3)[2]<=79) ans=ans+'70至79歲的調查員，進行四次EDU的增強檢定。\nAPP減少20點。\nSTR、DEX、CON三者合計共減少40點（請人工計算。）\n\n';
	else if (inStr.split(' ',3)[2]<=89) ans=ans+'80至89歲的調查員，進行四次EDU的增強檢定。\nAPP減少25點。\nSTR、DEX、CON三者合計共減少80點（請人工計算。）\n\n';
	
	
	abl[0]=Math.floor((Math.random()*6+1));
	abl[1]=Math.floor((Math.random()*6+1))
	abl[2]=Math.floor((Math.random()*6+1))
	if(inStr.split(' ',3)[2]<=19) ans=ans+'STR：['+abl+']*5-5 → '+((abl[0]+abl[1]+abl[2])*5-5)+'\n';
    else ans=ans+'STR：['+abl+']*5 → '+(abl[0]+abl[1]+abl[2])*5+'\n';
	abl[0]=Math.floor((Math.random()*6+1));
	abl[1]=Math.floor((Math.random()*6+1))
	abl[2]=Math.floor((Math.random()*6+1))
	ans=ans+'CON：['+abl+']*5 → '+(abl[0]+abl[1]+abl[2])*5+'\n';
	abl[0]=Math.floor((Math.random()*6+1));
	abl[1]=Math.floor((Math.random()*6+1))
	abl[2]=Math.floor((Math.random()*6+1))
	ans=ans+'DEX：['+abl+']*5 → '+(abl[0]+abl[1]+abl[2])*5+'\n';
	abl[0]=Math.floor((Math.random()*6+1));
	abl[1]=Math.floor((Math.random()*6+1))
	abl[2]=Math.floor((Math.random()*6+1))
	if (inStr.split(' ',3)[2]<=39) ans=ans+'APP：['+abl+']*5 → '+(abl[0]+abl[1]+abl[2])*5+'\n';
	else if (inStr.split(' ',3)[2]<=49) ans=ans+'APP：['+abl+']*5-5 → '+((abl[0]+abl[1]+abl[2])*5-5)+'\n';
	else if (inStr.split(' ',3)[2]<=59) ans=ans+'APP：['+abl+']*5-10 → '+((abl[0]+abl[1]+abl[2])*5-10)+'\n';
	else if (inStr.split(' ',3)[2]<=69) ans=ans+'APP：['+abl+']*5-15 → '+((abl[0]+abl[1]+abl[2])*5-15)+'\n';
	else if (inStr.split(' ',3)[2]<=79) ans=ans+'APP：['+abl+']*5-20 → '+((abl[0]+abl[1]+abl[2])*5-20)+'\n';
	else if (inStr.split(' ',3)[2]<=89) ans=ans+'APP：['+abl+']*5-25 → '+((abl[0]+abl[1]+abl[2])*5-25)+'\n';

	abl[0]=Math.floor((Math.random()*6+1));
	abl[1]=Math.floor((Math.random()*6+1))
	abl[2]=Math.floor((Math.random()*6+1))
	ans=ans+'POW：['+abl+']*5 → '+(abl[0]+abl[1]+abl[2])*5+'\n';
	abl=[];
	abl[0]=Math.floor((Math.random()*6+1));
	abl[1]=Math.floor((Math.random()*6+1))
	if(inStr.split(' ',3)[2]<=19) ans=ans+'SIZ：(['+abl+']+6)*5-5 → '+((abl[0]+abl[1]+6)*5-5)+'\n';
    else ans=ans+'SIZ：(['+abl+']+6)*5 → '+(abl[0]+abl[1]+6)*5+'\n';
	abl[0]=Math.floor((Math.random()*6+1));
	abl[1]=Math.floor((Math.random()*6+1))
	ans=ans+'INT：(['+abl+']+6)*5 → '+(abl[0]+abl[1]+6)*5+'\n';
	abl[0]=Math.floor((Math.random()*6+1));
	abl[1]=Math.floor((Math.random()*6+1))
	abl_temp=(abl[0]+abl[1]+6)*5;
	if(inStr.split(' ',3)[2]<=19){ 
	  ans=ans+'EDU：(['+abl+']+6)*5-5 → '+((abl[0]+abl[1]+6)*5-5)+'\n';
	}
    else if (inStr.split(' ',3)[2]<=39){
	  dice_100_a=Math.floor((Math.random()*100+1));
	  let edu_temp=0;
	  ans=ans+'\nEDU初始值：(['+abl+']+6)*5 → '+abl_temp+'\n';
	  if (dice_100_a>abl_temp || dice_100_a>=96){
	    edu_temp=Math.floor((Math.random()*10+1));
	    ans=ans+'第1次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 成功\n教育成長：1d10 → '+edu_temp+' 點技能點數。\n';
		abl_temp=abl_temp+edu_temp;
	  }
	  else ans=ans+'第1次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 失敗，EDU未成長。\n';
	  ans=ans+'EDU最終值 → '+abl_temp+'\n\n';
	}
	else if (inStr.split(' ',3)[2]<=49){
	  let edu_temp=0;
	  ans=ans+'\nEDU初始值：(['+abl+']+6)*5 → '+abl_temp+'\n';
	  for(let count=1;count<=2;count++){
	    dice_100_a=Math.floor((Math.random()*100+1));
	    edu_temp=0;
	    if (dice_100_a>abl_temp || dice_100_a>=96){
	      edu_temp=Math.floor((Math.random()*10+1));
	      ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 成功\n教育成長：1d10 → '+edu_temp+' 點技能點數。\n';
		  abl_temp=abl_temp+edu_temp;
	    }
	    else ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 失敗，EDU未成長。\n';
	  }
	  ans=ans+'EDU最終值 → '+abl_temp+'\n\n';
	}
	else if (inStr.split(' ',3)[2]<=59){
	  let edu_temp=0;
	  ans=ans+'\nEDU初始值：(['+abl+']+6)*5 → '+abl_temp+'\n';
	  for(let count=1;count<=3;count++){
	    dice_100_a=Math.floor((Math.random()*100+1));
	    edu_temp=0;
	    if (dice_100_a>abl_temp || dice_100_a>=96){
	      edu_temp=Math.floor((Math.random()*10+1));
	      ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 成功\n教育成長：1d10 → '+edu_temp+' 點技能點數。\n';
		  abl_temp=abl_temp+edu_temp;
	    }
	    else ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 失敗，EDU未成長。\n';
	  }
	  ans=ans+'EDU最終值 → '+abl_temp+'\n\n';
	}
	else if (inStr.split(' ',3)[2]<=69){
	  let edu_temp=0;
	  ans=ans+'\nEDU初始值：(['+abl+']+6)*5 → '+abl_temp+'\n';
	  for(let count=1;count<=4;count++){
	    let dice_100_a=Math.floor((Math.random()*100+1));
	    edu_temp=0;
	    if (dice_100_a>abl_temp || dice_100_a>=96){
	      edu_temp=Math.floor((Math.random()*10+1));
	      ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 成功\n教育成長：1d10 → '+edu_temp+' 點技能點數。\n';
		  abl_temp=abl_temp+edu_temp;
	    }
	    else ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 失敗，EDU未成長。\n';
	  }
	  ans=ans+'EDU最終值 → '+abl_temp+'\n\n';
	}
	else if (inStr.split(' ',3)[2]<=79){
	  let edu_temp=0;
	  ans=ans+'\nEDU初始值：(['+abl+']+6)*5 → '+abl_temp+'\n';
	  for(let count=1;count<=4;count++){
	    dice_100_a=Math.floor((Math.random()*100+1));
	    edu_temp=0;
	    if (dice_100_a>abl_temp || dice_100_a>=96){
	      edu_temp=Math.floor((Math.random()*10+1));
	      ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 成功\n教育成長：1d10 → '+edu_temp+' 點技能點數。\n';
		  abl_temp=abl_temp+edu_temp;
	    }
	    else ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 失敗，EDU未成長。\n';
	  }
	  ans=ans+'EDU最終值 → '+abl_temp+'\n\n';
	}
	else if (inStr.split(' ',3)[2]<=89){
	  let edu_temp=0;
	  ans=ans+'\nEDU初始值：(['+abl+']+6)*5 → '+abl_temp+'\n';
	  for(let count=1;count<=4;count++){
	    dice_100_a=Math.floor((Math.random()*100+1));
	    edu_temp=0;
	    if (dice_100_a>abl_temp || dice_100_a>=96){
	      edu_temp=Math.floor((Math.random()*10+1));
	      ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 成功\n教育成長：1d10 → '+edu_temp+' 點技能點數。\n';
		  abl_temp=abl_temp+edu_temp;
	    }
	    else ans=ans+'第'+count+'次EDU成長骰：(1D100)>'+abl_temp+' → '+dice_100_a+' → 失敗，EDU未成長。\n';
	  }
	  ans=ans+'EDU最終值 → '+abl_temp+'\n\n';
	}
	
	if(inStr.split(' ',3)[2]<=19){
	  abl_temp=[];
	  abl_temp[0]=Math.floor((Math.random()*6+1));
	  abl_temp[1]=Math.floor((Math.random()*6+1))
	  abl_temp[2]=Math.floor((Math.random()*6+1))
	  ans=ans+'\nLUK兩次擲骰擇優：\n';
	  abl[0]=Math.floor((Math.random()*6+1));
	  abl[1]=Math.floor((Math.random()*6+1))
	  abl[2]=Math.floor((Math.random()*6+1))
	  ans=ans+'第一次：['+abl_temp+']*5 、 第二次：['+abl+']*5\n'
	
	  if ((abl_temp[0]+abl_temp[1]+abl_temp[2])>(abl[0]+abl[1]+abl[2])) {ans=ans+'LUK → '+(abl_temp[0]+abl_temp[1]+abl_temp[2])*5+'\n';;}
	  else {ans=ans+'LUK → '+(abl[0]+abl[1]+abl[2])*5+'\n';;}
	  ans=ans+''
	}
	else {
	  abl[0]=Math.floor((Math.random()*6+1));
	  abl[1]=Math.floor((Math.random()*6+1));
	  abl[2]=Math.floor((Math.random()*6+1));
	  ans=ans+'LUK → ['+abl+']*5 → '+(abl[0]+abl[1]+abl[2])*5;
	}
	return ans;
  }

}

//運勢骰
function fortune(inStr) {
  let dice = Math.floor((Math.random()*1000+1));
  ans=['大吉だよ！\nやったね⭐︎','大吉……騙你的，差一點呢！\n只是吉而已呦(`・ω・´)','吉。🎉\n很棒呢！','中吉。\n還不錯吧。(ゝ∀･)','小吉。\n就是小吉，平淡過日子，願世界和平。☮','半吉。\n㊗️邪神祝福你！(^y^)','末吉。\n嗯～勉勉強強吧！(,,・ω・,,)。','末小吉。\n至少不壞呢！(*´∀`)','凶。\nσ ﾟ∀ ﾟ) ﾟ∀ﾟ)σ至少還有很多更糟的！','小凶。\n(́◉◞౪◟◉‵)運氣不是很好呢，怎麼辦？','半凶。\n有點糟糕～(◔౪◔)','末凶。\nすばらしく運がないな、君は。😊','大凶……⁉️\n欸這機率是千分之一喔？\n比大吉的百分之二還慘喔！？\n沒問題嗎？(((ﾟДﾟ;)))'];
  if (dice<=20) return ans[0];
  else if (dice<=90) return ans[1];
  else if (dice<=160) return ans[2];
  else if (dice<=250) return ans[3];
  else if (dice<=363) return ans[4];
  else if (dice<=444) return ans[5];
  else if (dice<=525) return ans[6];
  else if (dice<=600) return ans[7];
  else if (dice<=720) return ans[8];
  else if (dice<=825) return ans[9];
  else if (dice<=929) return ans[10];
  else if (dice<=999) return ans[11];
  else if (dice<=1000) return ans[12];
  else return undefined;
}

//NC投骰，未動工
function nechronicain(inStr){
}

//choice丟骰
function choice(inStr){
  if (inStr.toLowerCase().match(/^choice\s?\[[^,\[\]]+(,[^,\[\]]+)+]/) != null){
	return '基本骰組：自訂選項 ['+inStr.split('[',2)[1].split(']',1)[0].match(/[^,\[\]]+/g)+'] → '+inStr.split('[',2)[1].split(']',1)[0].match(/[^,\[\]]+/g)[Math.floor((Math.random()*(inStr.split('[',2)[1].split(']',1)[0].match(/[^,\[\]]+/g).length)))];
  }
}

//d66骰...
function d66(inStr){
  let dice=[Math.floor((Math.random()*6+1)),Math.floor((Math.random()*6+1))];
  if (inStr.toLowerCase().split(' ',1)[0]=='d66'){
    return ('基本骰組：D66 → '+dice[0]+dice[1]);
  }
  else if (inStr.toLowerCase().split(' ',1)[0]=='d66s'){
    if (dice[0]<=dice[1]) return ('基本骰組：D66S → ['+dice[1]+','+dice[0]+']'+' → '+dice[0]+dice[1]);
	else return ('基本骰組：D66S → ['+dice[1]+','+dice[0]+']'+' → '+dice[1]+dice[0]);
  }
  else return undefined;
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
    if (inStr.toLowerCase().split(' ',1)[0].match(/\d(d1\D)|d1$/)!=null) return ("請不要輸入d1，沒有這種骰子存在，用常數不好嗎 (´；ω；｀)？");
  　if (inStr.toLowerCase().split(' ',2)[1].match(/d0/)!=null) return undefined;
	
	for(let count_roll=1;count_roll<=inStr.split(' ',1)[0];count_roll++){
	  let dice_l=inStr.toLowerCase().split(' ',2)[1];
      let dice_c=inStr.toLowerCase().split(' ',2)[1];
      for(let count=1; count<=inStr.toLowerCase().split(' ',2)[1].match(/\d{1,}d\d{1,}/g).length;count++){
	    dice_temp='';
	    dice_temp=basic_dice(inStr.toLowerCase().split(' ',2)[1].match(/\d{1,}d\d{1,}/g)[count-1]);
		if (dice_temp==undefined) return ('一次丟超過一千顆骰是不行的哦。\n什麼系統會一次需要丟一千顆骰呢(´・ω・`)'); //超過一千顆骰直接中斷
		if (dice_temp=='0d') return ('0d…是什麼(´・ω・`)，請不要丟不存在的骰子。'); //0d直接中斷
	    dice_all[count-1] = '['+dice_temp+']';
	
   	    dice_sum[count-1]=0;
	    if (dice_temp.length>=20) msg_long=true;
	    for(let count2 = 1 ;count2<=dice_temp.length; count2++){
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
  
    if (inStr.toLowerCase().split(' ',1)[0].match(/\d(d1\D)|d1$/)!=null) return ("請不要輸入d1，沒有這種骰子存在，用常數不好嗎 (´；ω；｀)？");
  　if (inStr.toLowerCase().split(' ',1)[0].match(/d0/)!=null) return undefined;
  
    let dice_temp='';
    let dice_all =[];
    let dice_sum =[];
	let msg_long=false;
    for(let count=1; count<=inStr.toLowerCase().split(' ',1)[0].match(/\d{1,}d\d{1,}/g).length;count++){
	  dice_temp=basic_dice(inStr.toLowerCase().split(' ',1)[0].match(/\d{1,}d\d{1,}/g)[count-1]);
	  if (dice_temp==undefined) return ('一次丟超過一千顆骰是不行的哦。\n什麼系統會一次需要丟一千顆骰呢(´・ω・`)'); //超過一千顆骰直接中斷
	  if (dice_temp=='0d') return ('0d…是什麼(´・ω・`)，請不要丟不存在的骰子。'); //0d直接中斷
	  dice_all[count-1] = '['+dice_temp+']';
	
   	  dice_sum[count-1]=0;
	  if (dice_temp.length>=20) msg_long=true;
	  for(let count2 = 1 ;count2<=dice_temp.length; count2++){
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
	if (bdice.split("d",2)[0]>1000) return undefined; //如果骰子大於一千顆回傳undefined
	if (bdice.split("d",2)[0]==0) return '0d'; //如果骰子顆數為0的話
    let dice_group = [];
    for(let count = 1 ; count<=bdice.split("d",2)[0] ; count++){
	    dice_group[count-1] = Math.floor((Math.random()*bdice.split("d",2)[1])+1);
	  }
    return dice_group;
}
