// Require 
const {Client, GatewayIntentBits, EmbedBuilder, Events, Partials} = require('discord.js');
const http = require('http');
const querystring = require('querystring');
const cron = require('node-cron');
const config = require("./config.json");

//わかりやすく
const Members = config.members
const SupportMembers = config.supportMembers

//手数料botのdiscordユーザーID
const tesuryoBotId = "991590117036806234";
let keeperId = "";

//メンバーリスト
const MemberList = []//固定
const SMemberList = []//サポメン
const GMlist =config.guestmanagers

for (let member of Members){
    if(member.active) MemberList.push(member.id)
    if(member.active && member.keeper) keeperId = member.id
}

for (let sm of SupportMembers){
    SMemberList.push(sm.id)
}

//チャンネル
const myChannels ={
    ProClubVoteCh : '972816498215227402',  //プロクラブ出欠確認
    LeagueVoteCh  : '1011159177399373924', //リーグ出欠確認
    TestCh        : '1045804417628242054' //テスト用、自分のサーバー
}

// Create a new client instance
const client = new Client({ intents: 
    [GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions] ,
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready');
})

//メッセージを受け取ったときの挙動
client.on(Events.MessageCreate,message =>{
    //プロクラブ出欠確認用
    //リアクションしやすいように選択肢でリアクション
    if(message.author.id == tesuryoBotId && message.content == "" && message.channelId == myChannels.ProClubVoteCh){
        message.react("⭕");
        message.react("🚫");
        message.react("❌");
        console.log("react to attendance voting by all choices of emoji")
        return;
    }

    //リーグ出欠確認用
    //リアクションしやすいように選択肢でリアクション
    if(message.author.id == tesuryoBotId && message.content == "" && message.channelId == myChannels.LeagueVoteCh){
        message.react("⭕");
        message.react("🚫");
        message.react("❌");
        message.react("❓");
        console.log("react to attendance voting by all choices of emoji")
        return;
    }

    if(message.content == "?tesuryobot vote"){
        let nowday = new Date().getDay()
        if(isOff()){
            let text = "今日はオフ！"
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);
        }else{
            let text = "⭕ : できる\n🚫 : 22:30から参加\n❌ : できない"
            if(isLeague() && 1<= nowday && nowday <=5)text +="\n\nリーグ出欠確認も忘れずに。" 
            let embed = new EmbedBuilder().setTitle('プロクラブ参加').setColor(0xff4500).setDescription(text)
            client.channels.cache.get(myChannels.ProClubVoteCh).send({embeds:[embed]});
        }
        
        console.log("sent ProClubVoteMessage")
    }
    
    if(message.content.indexOf("?tesuryobot leaguevote")!=-1){
        console.log("vote")
        let now    = new Date()
        let dp = message.content.split(" ").slice(-1)[0]
        let title = dp + "に参加"
        let text = "⭕ : できる\n🚫 : 試合から参加できる\n❌ : できない\n❓ : 未定\n\n"
                        
        let embed = new EmbedBuilder().setTitle(title).setColor(0x00bfff).setDescription(text)
        client.channels.cache.get(myChannels.LeagueVoteCh).send({embeds:[embed]});
        console.log("sent VoteMessage")
            
         
    }

    if(message.content == "?tesuryobot tracker"){
        SendTrackerText(myChannels.ProClubVoteCh, myChannels.ProClubVoteCh)
    }
})

//リアクションが発生したときの挙動
client.on(Events.MessageReactionAdd,async (reaction,user)=>{
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        }catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
  
    //botによるリアクションなら何もしない
    if(user.bot){
        console.log("reacted by bot")
        return
    }
  
    //リアクションされたメッセージが手数料botのメッセージでないなら何もしない
    if(!(reaction.message.author.id == tesuryoBotId)){
        console.log("reacted message is not from tesuryobot")
        return
    }

    //手数料botへの固定・サポメン以外のリアクションは消す
    if(((!MemberList.includes(user.id)) && (!SMemberList.includes(user.id))) && (reaction.message.author.id == tesuryoBotId))
    {
        console.log("Not member")
        reaction.users.remove(user.id)
    }
  

    //手数料botへの固定・サポメンのリアクションは単一にする
    if(((MemberList.includes(user.id))|(SMemberList.includes(user.id))) && (reaction.message.author.id == tesuryoBotId) && (reaction.message.content =="") && ((reaction.message.channelId == myChannels.ProClubVoteCh)|(reaction.message.channelId == myChannels.LeagueVoteCh))){
        console.log(user.username +" react " + reaction.emoji.name)
        const userReactions = reaction.message.reactions.cache
        for (const r of userReactions.values()){
            if(r.emoji.name != reaction.emoji.name){
            r.users.remove(user.id);
            }
        }
    }
  
})

//httpサーバー立ち上げ
http.createServer(function(req, res){
    if (req.method == 'POST'){
        let data = "";
        req.on('data', function(chunk){
        data += chunk;
        });
        req.on('end', function(){
            if(!data){
                console.log("No post data");
                res.end();
                return;
            }
            let dataObject = querystring.parse(data);
            console.log("post:" + dataObject.type);
            if(dataObject.type == "wake"){
                console.log("Woke up in post");
                res.end();
                return;
            }
            res.end();
        });

    }else if (req.method == 'GET'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Discord Bot is active now\n');
    }
}).listen(3000);

//cron:プロクラブ出欠確認に投票投稿
cron.schedule(config.VoteTime,()=>{
    let nowday = new Date().getDay()

    //リーグ期間中かつ今日が日 じゃないなら出欠確認を出す
    if(!(isLeague() && isLeagueDay())){

        if(isOff()){
            let text = "今日はオフ！"
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);
        }else{
            let text = "⭕ : できる\n🚫 : 22:30から参加\n❌ : できない"
            if(isLeague() && 1<= nowday && nowday <=5)text +="\n\nリーグ出欠確認も忘れずに。" 
            let embed = new EmbedBuilder().setTitle('プロクラブ参加').setColor(0xff4500).setDescription(text)
            client.channels.cache.get(myChannels.ProClubVoteCh).send({embeds:[embed]});
        }
        console.log("sent ProClubVoteMessage")
    }
});

//cron:プロクラブ出欠追跡メッセージ送信
cron.schedule(config.TrackerTime,()=>{
    let nowday = new Date().getDay()
    //リーグ期間中で今日が土曜日 じゃないなら
    if(!(isLeague() && isLeagueDay())){
        if(!isOff()){
            SendTrackerText(myChannels.ProClubVoteCh, myChannels.ProClubVoteCh)
            console.log("sent TrackerMessage")
        }
        
    }
});

//cron:プロクラブ出欠追跡テキスト更新
cron.schedule(config.UpdateTime,()=>{
    if(!(isLeague() && isLeagueDay())){
        UpdateTrackerText(myChannels.ProClubVoteCh)
    }
});

//cron:全員回答完了か判定
//全員回答完了したならばジャッジメッセージ送信
cron.schedule(config.UpdateTime,async ()=>{
    
    let flag = await BooleanJudgeMessageExist(5); //全員回答したか
    
    //リーグ期間中で今日が土曜日 じゃない かつ　オフじゃない かつ　ジャッジメッセージがない なら
    if( !(isLeague() && isLeagueDay() ) && !isOff() && !flag){
        //リアクションした人取得
        let arr     = await GetVoteReaciton(5,["⭕","🚫","❌"])
        
        //各リアクションのメンバー
        let maru    = [...arr[0],...arr[1]].filter(id=>MemberList.includes(id)) //正規メンバーの⭕
        let smaru   = [...arr[0],...arr[1]].filter(id=>SMemberList.includes(id))//サポメンの⭕
        let batu    = arr[2]//❌

        //答えた人、答えてない人
        let Ans = [...arr[0], ...arr[1], ...arr[2]]
        let notAns = MemberList.filter(id => !Ans.includes(id))

        //判定用
        let fieldmemberNum = maru.length //フィールド正規メンバーの人数
        let smemberNum = smaru.length //サポメンの人数
        let delayNum = arr[1].length
        let keeperNum //キーパーの数
        let fieldNum //フィールドの数
        let judgeNum //活動かfinか判定用の変数
        
        //キーパーが⭕のとき(22:00-から)
        if(arr[0].includes(keeperId) | smaru.includes(keeperId)){
            keeperNum = 1
            fieldmemberNum -= 1
            fieldNum = fieldmemberNum + smemberNum
            judgeNum = fieldNum + notAns.length
        //キーパーが⭕のとき(22:30-から)
        }else if(arr[1].includes(keeperId) | smaru.includes(keeperId)){
            keeperNum = 1
            fieldmemberNum -= 1
            delayNum -= 1
            fieldNum = fieldmemberNum + smemberNum
            judgeNum = fieldNum + notAns.length
        //キーパーが❌のとき
        }else if(batu.includes(keeperId)){
            keeperNum = 0
            fieldNum = fieldmemberNum + smemberNum
            judgeNum = fieldNum + notAns.length
        //キーパーが未回答のとき
        }else if(notAns.includes(keeperId)){
            keeperNum = -1
            fieldNum = fieldmemberNum + smemberNum
            judgeNum = fieldNum + notAns.length - 1
        }
        
        //ゲスト管理者
        let gm = GetGuestManager()
        let text =""

        
        if(judgeNum < config.minPlayer){//fin
            console.log("fin")
            //全員回答済み
            if(notAns.length == 0){
                for (let id of [...arr[0],...arr[1]]){
                    text += "<@" + id+ "> "
                }
                text += "\n\n@⭕の人たち\n全員回答完了 "
            //未回答者アリ
            }else{
                for (let id of [...arr[0],...arr[1],...notAns]){
                    text += "<@" + id+ "> "
                }
                text += "\n\n@⭕と未回答の人たち\n全員回答完了してませんが"
            }
            text += `フィールド${config.minPlayer}人に満たないので今日はfin`
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

        }else if(notAns.length > 0 && fieldmemberNum == 10){//未回答がいるがフル集まった
            console.log("full")
            for (let id of [...arr[0],...arr[1],...notAns]){
                text += "<@" + id+ "> "
            }
            text += "\n\n@⭕と未回答の人たち\n全員回答完了してませんが"

            
            if(fieldmemberNum == 10 && delayNum == 0 && smemberNum == 0){//フィールド正規メンバーが10人&&サポメン0人
                text += "フィールド10人集まりました!\n**22:00から活動!**\n"

            
            }else if(fieldmemberNum == 10 && delayNum == 0 && smemberNum > 0){//フィールド正規メンバーが10人&&サポメン1人以上
                text += "フィールド10人集まりました!\n**22:00から活動!**\n"
                text += "サポメンさんは休みです!"
                
            
            }else if(fieldmemberNum == 10 && delayNum > 0 && smemberNum == 0){//22:30からのメンバー含んでフィールド正規メンバーが10人 && サポメン0人
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"

            
            }else if(fieldmemberNum == 10 && delayNum > 0 && smemberNum > 0){//22:30からのメンバーも含んでフィールド正規メンバーが10人&&サポメン1人以上
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"
                text += "サポメンさんは休みです!"
            }
            if(keeperNum==-1){
                text += "\n(キーパーは未回答)"
            }

            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

        }else if (notAns.length == 0){//全員回答完了の場合

            for (let id of [...arr[0],...arr[1]]){
                text += "<@" + id+ "> "
            }
            text += "\n\n@⭕の人たち\n全員回答完了 "

            if(fieldmemberNum == 10 && delayNum == 0 && smemberNum == 0){ //フィールド正規メンバーが10人&&サポメン0人
                text += "フィールド10人集まりました!\n**22:00から活動!**\n"

            
            }else if(fieldmemberNum == 10 && delayNum == 0 && smemberNum > 0){//フィールド正規メンバーが10人&&サポメン1人以上
                text += "フィールド10人集まりました!\n**22:00から活動!**\n"
                text += "サポメンさんは休みです!"
                
           
            }else if(fieldmemberNum == 10 && delayNum > 0 && smemberNum == 0){ //22:30からのメンバーも含んでフィールド正規メンバーが10人&&サポメン0人
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"

           
            }else if(fieldmemberNum == 10 && delayNum > 0 && smemberNum > 0){ //22:30からのメンバーも含んでフィールド正規メンバーが10人&&サポメン1人以上
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"
                text += "サポメンさんは休みです!"

            }else if(fieldmemberNum < 10 && delayNum == 0 && smemberNum == 0){ //フィールド正規メンバーが10人未満 && サポメン0人
                text += `フィールド${fieldNum}人集まりました!\n**22:00から活動!**\n`

            
            }else if(fieldmemberNum < 10 && delayNum == 0 && smemberNum > 0){//(to do)フィールド正規メンバーが10人未満 && サポメン1人以上
                //フィールドが10人超える
                if(fieldNum > 10){
                    text += `フィールド${fieldNum}人集まりました!\n**22:00から活動!**\n`
                    text += "サポメンは、が参加してください!"
                //フィールドが10人以下
                }else{
                    text += `フィールド${fieldNum}人集まりました!\n**22:00から活動!**\n`
                }

           
            }else if(fieldmemberNum < 10 && delayNum > 0 && smemberNum == 0){ //22:30からのメンバーも含んでフィールド正規メンバーが10人未満&&サポメン0人
                text += `フィールド${fieldNum}人集まりました!\n**22:30から活動!**\n`

           
            }else if(fieldmemberNum < 10 && delayNum > 0 && smemberNum > 0){ //(to do)22:30からのメンバーも含んでフィールド正規メンバーが10人未満&&サポメン1人以上
                //フィールドが10人超える
                if(fieldNum > 10){
                    text += `フィールド${fieldNum}人集まりました!\n**22:30から活動!**\n`
                    
                    let b =[]
                    let start = getRandomInt(0,delayNum)
                    for (let index = 0; index < delayNum; index++) {
                        b.push(smaru[(index + start) % smaru.length])
                    }

                    for (let id of arr[1].filter(id=>id!=keeperId)){
                        text += "<@" + id+ "> "
                    }
                    text += "と"
                    for (let id of b){
                        text += "<@" + id+ "> "
                    }
                    text += "他のサポメンさんはおやすみです"

                //フィールドが10人以下
                }else{
                    text += `フィールド${fieldNum}人集まりました!\n**22:30から活動!**\n`
                }

            }
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

            //ゲス募内容送信
            if(10 > fieldNum | keeperNum==0){
                let text2 = "@週担当 "
                //ゲス募管理者がどっちかいるとき
                for (let id of gm){
                    text2 += "<@" + id+ "> "
                }
                text2 +=`\nゲス募よろしくお願いします!\n ゲス募:`
                if(fieldNum<10) text2 += `**フィールド${10-fieldNum}人**`
                if(keeperNum ==0) text2+= " **GK**"
                client.channels.cache.get(myChannels.ProClubVoteCh).send(text2);
            }
            
        }
    }
});

//cron:回答リマインダー
cron.schedule(config.reminderTime,async () =>{

    //リーグ期間中で今日が土曜日 じゃないなら
    if(!(isLeague() && isLeagueDay()) && !isOff()){
        let flag = await BooleanJudgeMessageExist(5)
        if(!flag){
            let arr = await GetVoteReaciton(5,["⭕","🚫","❌"])

            let ans = [...arr[0],...arr[1],...arr[2]]
            let notAns = MemberList.filter(id => !ans.includes(id))

            if(notAns.length>0){
                let text = "まだの人回答宜しくお願いします！\n"
                for (let id of notAns){
                    text += "<@" + id+ "> "
                }
                client.channels.cache.get(myChannels.ProClubVoteCh).send(text);
            }
        } 
    }
})

//cron:20時に全員回答していないときの挙動
cron.schedule(config.JudgeTime,async ()=>{
    let nowday = new Date().getDay()

    //リーグ期間中で今日が土曜日 じゃないなら
    //オフじゃないなら
    if(!(isLeague() && isLeagueDay())&&!isOff()){
        
        let flag = await BooleanJudgeMessageExist(5)
    
        if(!flag){
            let arr     = await GetVoteReaciton(5,["⭕","🚫","❌"])
        
            //各リアクションのメンバー
            let maru    = [...arr[0],...arr[1]].filter(id=>MemberList.includes(id)) //正規メンバーの⭕
            let smaru   = [...arr[0],...arr[1]].filter(id=>SMemberList.includes(id))//サポメンの⭕
            let batu    = arr[2]//❌

            //答えた人、答えてない人
            let Ans = [...arr[0], ...arr[1], ...arr[2]]
            let notAns = MemberList.filter(id => !Ans.includes(id))

            //判定用
            let fieldmemberNum = maru.length //フィールド正規メンバーの人数
            let smemberNum = smaru.length //サポメンの人数
            let delayNum = arr[1].length
            let keeperNum= 0 //キーパーの数
            let fieldNum = fieldmemberNum + smemberNum//フィールドの数
            let judgeNum = fieldNum + notAns.length//活動かfinか判定用の変数

            //キーパーが⭕のとき(22:00-から)
            if(arr[0].includes(keeperId) | smaru.includes(keeperId)){
                keeperNum = 1
                fieldmemberNum -= 1
                fieldNum = fieldmemberNum + smemberNum
                judgeNum = fieldNum + notAns.length
            //キーパーが⭕のとき(22:30-から)
            }else if(arr[1].includes(keeperId) | smaru.includes(keeperId)){
                keeperNum = 1
                fieldmemberNum -= 1
                delayNum -= 1
                fieldNum = fieldmemberNum + smemberNum
                judgeNum = fieldNum + notAns.length
            //キーパーが❌のとき
            }else if(batu.includes(keeperId)){
                keeperNum = 0
                fieldNum = fieldmemberNum + smemberNum
                judgeNum = fieldNum + notAns.length
            //キーパーが未回答のとき
            }else if(notAns.includes(keeperId)){
                keeperNum = -1
                fieldNum = fieldmemberNum + smemberNum
                judgeNum = fieldNum + notAns.length - 1
            }

            let gm = GetGuestManager()
            let text =""

            
            if(fieldNum>=config.minPlayer){
                for (let id of [...arr[0],...arr[1]]){
                    text += "<@" + id+ "> "
                }
                text += "@⭕の人たち"
                text += `全員回答完了していませんが、フィールド${fieldNum}人集まってるので活動ありです！\n`
                if(delayNum >0){
                    text += "**22:30から活動!**\n"
                }else{
                    text += "**22:00から活動!**\n"
                }
                client.channels.cache.get(myChannels.ProClubVoteCh).send(text)

                if(10 > fieldNum | keeperNum==0){
                    let text2 = "@週担当 "

                    for (let id of gm){
                        text2 += "<@" + id+ "> "
                    }
                    text2 +=`\nゲス募よろしくお願いします!(未回答者をいつまで待つかは任せます)\n ゲス募:`
                    if(fieldNum<10) text2 += `**フィールド${10-fieldNum}人**`
                    if(keeperNum ==0) text2+= " **GK**"
                    client.channels.cache.get(myChannels.ProClubVoteCh).send(text2)
                }

            }else{
                text += `全員回答完了していませんが、`
                for (let id of notAns){
                    text+= ` <@${id}> `
                }
                text +=`の中から${config.minPlayer - fieldNum}人⭕なら活動アリです！\n`
                if(delayNum >0){
                    text += "活動ありなら今のところ**22:30から活動予定**\n"
                }else{
                    text += "活動ありなら今のところ**22:00から活動予定**\n"
                    text += "未回答者が22:30~からなら22:30から活動です\n"
                }
                client.channels.cache.get(myChannels.ProClubVoteCh).send(text)

                if(10 > fieldNum | keeperNum==0){
                    let text2 = "@週担当 "
                    
                    for (let id of gm){
                        text2 += "<@" + id+ "> "
                    }
                    text2 +=`\n活動ありならゲス募よろしくお願いします!(未回答者をいつまで待つかは任せます)\n ゲス募:`
                    if(fieldNum<10) text2 += `**フィールド${10-judgeNum}~2人**`
                    if(keeperNum ==0) text2+= " **GK**"
                    client.channels.cache.get(myChannels.ProClubVoteCh).send(text2)
                }
            }
                
            
        }
        
    }
})

//cron:リーグ出欠
cron.schedule(config.LeagueVoteTime,()=>{
    let now    = new Date()

    for (let s of config.leagueSchedule){
        if (new Date(s.start) <= now && now <= new Date(s.end)){
            let text;
            let title;
            
            switch (s.name) {
                case "rasleo":
                    title = "土曜日のリーグ戦(ラスレオ)"
                    text = "⭕: 参加可\n🚫 : 遅れて参加可\n❌ : 参加できない\n❓ : 未定\n\n"
                    text += "※試合が23:30からなので、活動は22:30から"
                    break;
                case "AVPCL":
                    title = "金曜日のリーグ戦(AVPCL)"
                    text = "⭕ : 参加可\n🚫 : 遅れて参加可\n❌ : 参加できないn❓ : 未定\n\n"
                    text += "※試合が23:00からなので、活動は22:00から"
                    break;
                default:
                    title = "公式戦に参加"
                    text = "⭕ : できる\n🚫 : 試合から参加できる\n❌ : できない\n❓ : 未定\n\n"
                    break;
            }
            let embed = new EmbedBuilder().setTitle(title).setColor(0x00bfff).setDescription(text)
            client.channels.cache.get(myChannels.LeagueVoteCh).send({embeds:[embed]});
            console.log("sent VoteMessage")
        }
    }        
})

//cron:ゲスト管理
cron.schedule(config.GuestManagerTime,()=>{
    let arr = GetGuestManager()
    let text = "今週の活動・ゲスト管理:"
    for (let id of arr){
        text += "<@" + id+ "> "
    }
    client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

})

//以下、便利関数

//オフの日判定
function isOff(){
    let now = new Date()
    let nowday = now.getDay()
    if(config.offDay.includes(nowday))return true

    let nowyear = now.getFullYear()
    for (let od of config.offDate){
        let s = new Date(nowyear + od.start)
        let e = new Date(nowyear + od.end)

        if( s <= now && now<=e){
            return true
        }
    }
    return false
}

//リーグ期間判定
function isLeague(){
    let now = new Date()
    for (let d of config.leagueSchedule){
        if (new Date(d.start) <= now && now <= new Date(d.end)){
            return true
        }
    }
    return false
}

function isLeagueDay(){
    let nowday = new Date().getDay()
    for (let d of config.leagueSchedule){
        if (d.leagueDay == nowday){
            return true
        }
    }
    return false
}
// 指定のユーザー、内容、チャンネルから最新n個メッセージをとってくる
async function GetTargetMessage(channel,n){
    return await client.channels.cache.get(channel).messages.fetch({limit:n})
}

// リアクションしたユーザーのidの配列の絵文字ごとの配列を返す
async function GetReactionUserIds(msg, emojis){
    let ResultArray = []
    for (const emoji of emojis){
        let c = await msg.reactions.cache.get(emoji).users.fetch().catch(e => {console.log(e)});
        c = c.filter(usr => !usr.bot).map(usr =>{ return usr.id });
        ResultArray.push(c)
    }
    return ResultArray
}

//ジャッジメッセージがあるか
async function BooleanJudgeMessageExist(messageNum){
    let nowday = new Date().getDay()
    let MsgCollection = await GetTargetMessage(myChannels.ProClubVoteCh, messageNum);
    for (const m of MsgCollection.values()) {
        if(m.author.id == tesuryoBotId && m.content.match("全員回答完了") && m.createdAt.getDay() == nowday){
            return true
        }
    }
    return false
}

//投票者取得
async function GetVoteReaciton(messageNum,EmojiList){
    let nowday = new Date().getDay()
    let MsgCollection = await GetTargetMessage(myChannels.ProClubVoteCh, messageNum);
    for (const m of MsgCollection.values()) {
        if(m.author.id == tesuryoBotId && m.content == "" && m.createdAt.getDay() == nowday){
            let arr = await GetReactionUserIds(m,EmojiList);
            return arr
        }
    }
   return false
}

//　ゲスト管理者計算
function GetGuestManager(){
    let day1 = new Date("2023/06/11");
    let day2 = new Date();
    let num = Math.floor((day2 - day1) / 86400000 / 7 ) * 2 % GMlist.length
    
    return [GMlist[num],GMlist[num+1]]
}

// 実施判定のテキスト取得
function GetTrackerText(arr){
    if(arr.length != 3){
        return "error:length of emoji array is not 3"
    }
    //時間
    let now = new Date(); 
    let Hour = now.getHours(); 
    let Min = now.getMinutes();
    let Sec = now.getSeconds();
    let text = "Tracker"
    
    let Ans = [...arr[0],...arr[1],...arr[2]] //答えた人
    let notAns = MemberList.filter(id => !Ans.includes(id)) //未回答の人（固定のみ）

    let maru = [...arr[0],...arr[1]].filter(id=>MemberList.includes(id))
    let smaru = [...arr[0],...arr[1]].filter(id=>SMemberList.includes(id))

    //判定用
    let fieldNum = maru.length
    let GkNum = 0
    if (maru.includes(keeperId)){
        fieldNum -= 1
        GkNum = 1
    }
    
    let text1 = "⭕:"
    let text2 = "❓:"
    let text3 = "❌:"

    //まるの人
    if(arr[0].length > 0){
        for (let id of arr[0]){
            for (let mem of Members){
                if(id == mem.id){
                    text1 += mem.name+" "
                    break
                }
            }
            for (let mem of SupportMembers){
                if(id == mem.id){
                    text1 += mem.name+"(ｻﾎﾟﾒﾝ) "
                    break
                }
            }
        }
    }

    //遅れの人
    if(arr[1].length>0){
        for (let id of arr[1]){
            for (let mem of Members){
                if(id == mem.id){
                    text1 += mem.name+"(22:30-) "
                }
            }
            for (let mem of SupportMembers){
                if(id == mem.id){
                    text1 += mem.name+"(ｻﾎﾟﾒﾝ)(22:30-) "
                    break
                }
            }
        }
    }

    //×の人
    if(arr[2].length>0){
        for (let id of arr[2]){
            for (let mem of Members){
                if(id == mem.id){
                    text3 += mem.name+" "
                    break
                }
            }
            for (let mem of SupportMembers){
                if(id == mem.id){
                    text3 += mem.name+" "
                    break
                }
            }
        }
    }

    //未回答の人
    if(notAns.length>0){
        for (let id of notAns){
            for (let mem of Members){
                if(id == mem.id){
                    text2 += mem.name+" "
                    break
                }
            }
        }
    }

    text += `:[${Hour}:${Min}:${Sec}時点の人数]\n**フィールド${fieldNum+smaru.length}人(うちｻﾎﾟﾒﾝ${smaru.length}人)・GK${GkNum}人・未回答${notAns.length}人\n残り${10-fieldNum}枠**`
    text += ("```" + text1 + "```")
    text += ("```" + text2 + "```")
    text += ("```" + text3 + "```")

    return text
}

// 指定したチャンネルに実施判定テキスト送信
async function SendTrackerText(VoteCh,SendCh){
    let MsgCollection = await GetTargetMessage(VoteCh, 5);
    for (const m of MsgCollection.values()) {
        if(m.author.id == tesuryoBotId && m.content == "" && m.createdAt.getDay() == new Date().getDay()){
            let arr = await GetReactionUserIds(m, ["⭕","🚫","❌"]);
            let text = GetTrackerText(arr)
            client.channels.cache.get(SendCh).send(text);
            break
        }
    }
}

// テキスト更新
async function UpdateTrackerText(VoteCh){
    let msg;
    let flag =false;
    //メッセコレクションの取得
    let MsgCollection = await GetTargetMessage(VoteCh, 10);
    //投票メッセを探す
    for (const m of MsgCollection.values()) {
        if(m.author.id==tesuryoBotId && m.content == "" && m.createdAt.getDay() == new Date().getDay()){
            msg = m
            flag = true
            break
        }
    }
    //見つかった
    if(flag){
        let arr = await GetReactionUserIds(msg,["⭕","🚫","❌"]);//リアクションの集計
        //ジャッジメッセージの走査
        let msg2;
        let flag2 = false;
        for (const m of MsgCollection.values()) {
            if(m.author.id==tesuryoBotId&&m.content.match("Tracker") && m.createdAt.getDay() == new Date().getDay()){
                msg2 = m;
                flag2 = true;
                break
            }
        }
        //見つかった
        if(flag2){
            let text = GetTrackerText(arr)
            msg2.edit(text)
            .catch(console.error);
        }
        else{
            console.log("cannot find tracker message")   
        }
    }
    else{
        console.log("cannot find vote message")
    }
}

//数値丸め
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// Login to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);