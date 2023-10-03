// Require 
const {Client, GatewayIntentBits, EmbedBuilder, Events, Partials} = require('discord.js');
const http = require('http');
const querystring = require('querystring');
const cron = require('node-cron');
const config = require("./config.json");

//わかりやすく
const Members = config.members
//手数料botのdiscordユーザーID
const botID = "991590117036806234";

//メンバーリスト
const MemberList = []//固定
const SMemberList = []//サポメン
const gusetManagerList = []

let keeperId = "";
for (let member of Members){
    if(member.active) {
        MemberList.push(member.id)
        if(member.keeper) keeperId = member.id
    }else{
        SMemberList.push(member.id)
    }
    if(member.guestmanager) gusetManagerList.push(member.id)
}

//チャンネル
const myChannels ={
    ProClubVoteCh : '972816498215227402',  //プロクラブ出欠確認
    WeekVoteCh    : '1138445755619758150',
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
client.once('ready', async () => {
    console.log('Ready');
})

//メッセージを受け取ったときの挙動
client.on(Events.MessageCreate,async (message) =>{
    //プロクラブ出欠確認用
    //リアクションしやすいように選択肢でリアクション
    if(message.author.id == botID 
        && message.content == "" 
        && (message.channelId == myChannels.ProClubVoteCh | message.channelId == myChannels.WeekVoteCh)){
        message.react("⭕");
        message.react("❌");
        console.log("react to attendance voting by all choices of emoji")
        return;
    }
})

//リアクションが発生したときの挙動
client.on(Events.MessageReactionAdd,async (reaction,user)=>{
    //過去のメッセージ取得
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
    if(user.bot) return;
  
    //リアクションされたメッセージが手数料botのメッセージでないなら何もしない
    if(reaction.message.author.id != botID) return;

    //手数料botへの固定・サポメン以外のリアクションは消す
    if(!MemberList.includes(user.id) && !SMemberList.includes(user.id)) {
        console.log("Not member")
        reaction.users.remove(user.id)
    }
  
    //当日出欠，リーグ出欠の手数料botへの固定・サポメンのリアクションは単一にする
    if(reaction.message.channelId == myChannels.ProClubVoteCh | reaction.message.channelId == myChannels.WeekVoteCh){
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
    //今日がオフじゃないなら出欠確認を出す
    if(isOff()){
        let text = "今日はオフ！出欠がわかる日は<#1138445755619758150>へ"
        client.channels.cache.get(myChannels.ProClubVoteCh).send(text);
    }else{
        let text = "⭕ : できる\n❌ : できない"
        let embed = new EmbedBuilder().setTitle('プロクラブ参加').setColor(0xff4500).setDescription(text)
        client.channels.cache.get(myChannels.ProClubVoteCh).send({embeds:[embed]});
    }
    console.log("sent ProClubVoteMessage")
});

//cron:プロクラブ出欠追跡メッセージ送信
cron.schedule(config.TrackerTime,()=>{
    //今日がオフじゃないなら
    if(!isOff()){
        SendTrackerText(myChannels.ProClubVoteCh, myChannels.ProClubVoteCh)
        console.log("sent TrackerMessage")
    }
});

//cron:プロクラブ出欠追跡テキスト更新
cron.schedule(config.UpdateTime,()=>{
    if(!isOff()) UpdateTrackerText(myChannels.ProClubVoteCh);
});

//cron:全員回答完了か判定
//全員回答完了したならばジャッジメッセージ送信
cron.schedule(config.confirmTime,async ()=>{
    let flag = await BooleanJudgeMessageExist(5); //全員回答したか
    
    //オフじゃない かつ　ジャッジメッセージがない なら
    if(!isOff() && !flag){
        //リアクションした人取得
        let userIdEachReactionList = await GetAllTodayVoteReaction()

        //各リアクションのメンバー
        let maru    = userIdEachReactionList[0].filter(id=>MemberList.includes(id)) //正規メンバーの⭕
        let smaru   = userIdEachReactionList[0].filter(id=>SMemberList.includes(id))//サポメンの⭕
        let batu    = userIdEachReactionList[1]//❌

        //答えた人、答えてない人
        let Ans = [...userIdEachReactionList[0], ...userIdEachReactionList[1]]
        let notAns = MemberList.filter(id => !Ans.includes(id))

        //判定用
        let fieldmemberNum = maru.length //フィールド正規メンバーの人数
        let smemberNum = smaru.length //サポメンの人数
        let keeperNum //キーパーの数
        let fieldNum //フィールドの数
        let judgeNum //活動かfinか判定用の変数
        
        //キーパーが⭕のとき
        if(userIdEachReactionList[0].includes(keeperId)){
            keeperNum = 1
            fieldmemberNum -= 1
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
            //全員回答済み
            if(notAns.length == 0){
                for (let id of userIdEachReactionList[0]) text += `<@${id}> `;
                text += "\n@⭕の人たち\n全員回答完了 "
            //未回答者アリ
            }else{
                for (let id of [...userIdEachReactionList[0],...notAns]) text += `<@${id}> `;
                text += "\n@⭕と未回答の人たち\n全員回答完了してませんが"
            }
            text += `フィールド${config.minPlayer}人に満たないので今日はfin`
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

        }else if(notAns.length > 0 && fieldmemberNum == 10){//未回答がいるがフル集まった
            console.log("full")
            for (let id of [...userIdEachReactionList[0],...notAns]) text += `<@${id}> `;
            text += "\n@⭕と未回答の人たち\n全員回答完了してませんが"
                
            if(fieldmemberNum == 10 && smemberNum == 0){//22:30からのメンバー含んでフィールド正規メンバーが10人 && サポメン0人
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"
            }else if(fieldmemberNum == 10 && smemberNum > 0){//22:30からのメンバーも含んでフィールド正規メンバーが10人&&サポメン1人以上
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"
                text += "サポメンさんは休みです!"
            }
            if(keeperNum==-1){
                text += "\n(キーパーは未回答)"
            }
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

        }else if (notAns.length == 0){//全員回答完了の場合

            for (let id of userIdEachReactionList[0])text += `<@${id}> `;
            text += "\n\n@⭕の人たち\n全員回答完了 "

            if(fieldmemberNum == 10 && smemberNum == 0){ //22:30からのメンバーも含んでフィールド正規メンバーが10人&&サポメン0人
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"

           
            }else if(fieldmemberNum == 10 && smemberNum > 0){ //22:30からのメンバーも含んでフィールド正規メンバーが10人&&サポメン1人以上
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"
                text += "サポメンさんは休みです!"

            }else if(fieldmemberNum < 10 && smemberNum == 0){ //22:30からのメンバーも含んでフィールド正規メンバーが10人未満&&サポメン0人
                text += `フィールド${fieldNum}人集まりました!\n**22:30から活動!**\n`
           
            }else if(fieldmemberNum < 10 && smemberNum > 0){ //(to do)22:30からのメンバーも含んでフィールド正規メンバーが10人未満&&サポメン1人以上
                
            }
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

            //ゲス募内容送信
            if(10 > fieldNum | keeperNum == 0){
                let text2 = "@週担当 "
                //ゲス募管理者がどっちかいるとき
                for (let id of gm) text2 += `<@${id}> `;
                text2 +=`\nゲス募よろしくお願いします!\n ゲス募:`
                if( fieldNum < 10) text2 += `**フィールド${10-fieldNum}人**`
                if( keeperNum == 0) text2+= " **GK**"
                client.channels.cache.get(myChannels.ProClubVoteCh).send(text2);
            }
        }
    }
});

//cron:回答リマインダー
cron.schedule(config.reminderTime,async () =>{
    //リーグ期間中で今日が土曜日 じゃないなら
    if(!isOff()){
        let flag = await BooleanJudgeMessageExist(5)
        if(!flag){
            let arr = await GetAllTodayVoteReaction()

            let ans = [...arr[0],...arr[1]]
            let notAns = MemberList.filter(id => !ans.includes(id))

            if(notAns.length>0){
                let text = "まだの人回答宜しくお願いします！\n"
                for (let id of notAns)text += `<@${id}> `;
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
            let userIdEachReactionList = await GetAllTodayVoteReaction()
            
            //各リアクションのメンバー
            let maru    = userIdEachReactionList[0].filter(id=>MemberList.includes(id)) //正規メンバーの⭕
            let smaru   = userIdEachReactionList[0].filter(id=>SMemberList.includes(id))//サポメンの⭕
            let batu    = userIdEachReactionList[1]//❌

            //答えた人、答えてない人
            let Ans = [...userIdEachReactionList[0], ...userIdEachReactionList[1]]
            let notAns = MemberList.filter(id => !Ans.includes(id))

            //判定用
            let fieldmemberNum = maru.length //フィールド正規メンバーの人数
            let smemberNum = smaru.length //サポメンの人数
            let keeperNum= 0 //キーパーの数
            let fieldNum = fieldmemberNum + smemberNum//フィールドの数
            let judgeNum = fieldNum + notAns.length//活動かfinか判定用の変数

            //キーパーが⭕のとき
            if(userIdEachReactionList[0].includes(keeperId)){
                keeperNum = 1
                fieldmemberNum -= 1
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
                for (let id of userIdEachReactionList[0])text += `<@${id}> `;
                text += "@⭕の人たち"
                text += `全員回答完了していませんが、フィールド${fieldNum}人集まってるので活動ありです！\n`
                text += "**22:30から活動!**\n"
                client.channels.cache.get(myChannels.ProClubVoteCh).send(text)

                if(10 > fieldNum | keeperNum==0){
                    let text2 = "@週担当 "

                    for (let id of gm)text2 += `<@${id}> `;
                    text2 +=`\nゲス募よろしくお願いします!(未回答者をいつまで待つかは任せます)\n ゲス募:`
                    if(fieldNum<10) text2 += `**フィールド${10-fieldNum}人**`
                    if(keeperNum ==0) text2+= " **GK**"
                    client.channels.cache.get(myChannels.ProClubVoteCh).send(text2)
                }

            }else{
                text += `全員回答完了していませんが、`
                for (let id of notAns) text += `<@${id}> `;
                text +=`の中から${config.minPlayer - fieldNum}人⭕なら活動アリです！\n回答したら何か連絡ください。\n`
                text += "活動ありなら**22:30から活動予定**\n"
                client.channels.cache.get(myChannels.ProClubVoteCh).send(text)

                if(10 > fieldNum | keeperNum==0){
                    let text2 = "@週担当 "
                    
                    for (let id of gm)text2 += `<@${id}> `;
                    text2 +=`\n活動ありならゲス募よろしくお願いします!(未回答者をいつまで待つかは任せます)\n ゲス募:`
                    if(fieldNum<10) text2 += `**フィールド${10-judgeNum}~2人**`
                    if(keeperNum ==0) text2+= " **GK**"
                    client.channels.cache.get(myChannels.ProClubVoteCh).send(text2)
                }
            }
        }
    }
})

//cron:ゲスト管理
cron.schedule(config.GuestManagerTime,()=>{
    let arr = GetGuestManager()
    let text = "今週の活動・ゲスト管理:"
    for (let id of arr) text += `<@${id}> `;
    client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

})

//cron:週出欠リアクションリセット
cron.schedule(config.WeekVoteResetTime,async ()=>{
    let emojis = ["⭕","❌"]
    let MsgCollection = await client.channels.cache.get(myChannels.WeekVoteCh).messages.fetch({limit:5});
    for (const m of MsgCollection.values()){
        await m.reactions.removeAll();
        for (let i=0 ; i<emojis.length;i++) await m.react(emojis[i])
    }
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

// 指定のユーザー、内容、チャンネルから最新n個メッセージをとってくる
async function GetTargetMessage(channel,n){
    return await client.channels.cache.get(channel).messages.fetch({limit:n})
}

//ジャッジメッセージがあるか
async function BooleanJudgeMessageExist(messageNum){
    let nowday = new Date().getDay()
    let MsgCollection = await GetTargetMessage(myChannels.ProClubVoteCh, messageNum);
    for (const m of MsgCollection.values()) {
        if(m.author.id == botID && m.content.match("全員回答完了") && m.createdAt.getDay() == nowday){
            return true
        }
    }
    return false
}

//その日の当日出欠と週出欠の合算のリアクション取得
async function GetAllTodayVoteReaction(){
    let nowday = new Date().getDay()
    let days = ["日","月","火","水","木","金","土"]

    let TodayVoteReaction;
    let WeekVoteReaction;
    
    await Promise.all([GetTodayVoteReaction(),GetWeekVoteReaction(days[nowday])])
    .then(values =>{
        TodayVoteReaction = values[0]
        WeekVoteReaction = values[1]
    })
    
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < WeekVoteReaction[i].length;j++ ){
            let id = WeekVoteReaction[i][j]
            if(!TodayVoteReaction[0].includes(id) && !TodayVoteReaction[1].includes(id)){
                TodayVoteReaction[i].push(id)
            }
        }
    }

    return TodayVoteReaction
}

//当日出欠のリアクション取得
async function GetTodayVoteReaction(channel = myChannels.ProClubVoteCh, emojis = ["⭕","❌"]){
    let nowday = new Date().getDay();
    let TodayVoteArray = []
    let MsgCollection = await client.channels.cache.get(channel).messages.fetch({limit:5});

    for (const m of MsgCollection.values()) {
        if(m.author.id == botID && m.content == ""){
            for (const emoji of emojis){
                TodayVoteArray.push(m.reactions.cache.get(emoji).users.fetch()
                .then(data => {
                    return data.filter(usr => !usr.bot).map(usr =>{ return usr.id });
                })
                .catch(e => {console.log(e)}))
            }
            break;
        }
    }
    return Promise.all(TodayVoteArray)
}

//週出欠のリアクション取得
async function GetWeekVoteReaction(titleName,channel=myChannels.WeekVoteCh,emojis = ["⭕","❌"]){
    let weekVoteArray = []

    let MsgCollection = await client.channels.cache.get(channel).messages.fetch({limit:5});
    for (const m of MsgCollection.values()) {
        if(m.author.id == botID && m.embeds[0].title == titleName){
            for (const emoji of emojis){
                weekVoteArray.push(m.reactions.cache.get(emoji).users.fetch()
                .then(data => {
                    return data.filter(usr => !usr.bot).map(usr =>{ return usr.id });
                })
                .catch(e => {console.log(e)}))
            }
            break;
        }
    }
    return Promise.all(weekVoteArray)
}

//　ゲスト管理者計算
function GetGuestManager(){
    let day1 = new Date("2023/06/11");
    let day2 = new Date();
    let num = Math.floor((day2 - day1) / 86400000 / 7 ) * 2 % gusetManagerList.length
    
    return [gusetManagerList[num],gusetManagerList[num+1]]
}

// トラッカーのテキスト取得
function GetTrackerText(userIdEachReactionList){
    
    //時間
    let now = new Date(); 
    let Hour = now.getHours(); 
    let Min = now.getMinutes();
    let Sec = now.getSeconds();
    let text = "Tracker"
    
    //答えた人
    let userIdAlreadyAnsweredList = [...userIdEachReactionList[0],...userIdEachReactionList[1]]
  
    //答えてない人
    let userIdNotAnsweredList = MemberList.filter(id => !userIdAlreadyAnsweredList.includes(id)) //未回答の人（固定のみ）
    
    let maru  = userIdEachReactionList[0].filter(id=>MemberList.includes(id))
    let smaru = userIdEachReactionList[0].filter(id=>SMemberList.includes(id))

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
    if(userIdEachReactionList[0].length > 0){
        for (let id of userIdEachReactionList[0]){
            for (let mem of Members){
                if(id == mem.id){
                    if(!mem.support){
                        text1 += mem.name+" "
                    }else{
                        text1 += mem.name+"(ｻﾎﾟﾒﾝ) "
                    }
                    break
                }
            }
        }
    }
    //未回答の人
    if(userIdNotAnsweredList.length>0){
        for (let id of userIdNotAnsweredList){
            for (let mem of Members){
                if(id == mem.id){
                    text2 += mem.name+" "
                    break
                }
            }
        }
    }
    //×の人
    if(userIdEachReactionList[1].length>0){
        for (let id of userIdEachReactionList[1]){
            for (let mem of Members){
                if(id == mem.id){
                    if(!mem.support){
                        text3 += mem.name+" "
                    }else{
                        text3 += mem.name+"(ｻﾎﾟﾒﾝ) "
                    }
                    break
                }
            }
        }
    }

    text += `:[${Hour}:${Min}:${Sec}時点の人数]\n**フィールド${fieldNum+smaru.length}人(うちｻﾎﾟﾒﾝ${smaru.length}人)・GK${GkNum}人・未回答${userIdNotAnsweredList.length}人\n残り${10-fieldNum}枠**`
    text += ("```" + text1 + "```")
    text += ("```" + text2 + "```")
    text += ("```" + text3 + "```")

    return text
}

// 指定したチャンネルに実施判定テキスト送信
async function SendTrackerText(VoteCh,SendCh){
    let arr = await GetAllTodayVoteReaction();
    let text = GetTrackerText(arr);
    client.channels.cache.get(SendCh).send(text);
}

// テキスト更新
async function UpdateTrackerText(VoteCh){
    let flag =false;
    //メッセコレクションの取得
    let MsgCollection = await GetTargetMessage(VoteCh, 10);
    //投票メッセを探す
    for (const m of MsgCollection.values()) {
        if(m.author.id==botID && m.content == "" && m.createdAt.getDay() == new Date().getDay()){
            flag = true
            break
        }
    }
    //見つかった
    if(flag){
        let arr = await GetAllTodayVoteReaction()
        //ジャッジメッセージの走査
        let msg2;
        let flag2 = false;
        for (const m of MsgCollection.values()) {
            if(m.author.id==botID&&m.content.match("Tracker") && m.createdAt.getDay() == new Date().getDay()){
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

//client.login(token);