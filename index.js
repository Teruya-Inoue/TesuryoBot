// Require 
const {
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    Events, 
    Partials,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder} = require('discord.js');

const http = require('http');
const request = require('request');
const cron = require('node-cron');
const config = require("./config.json");
const memberJson = require("./member.json")
let scheduleJson = require("./scheduleConfig.json")
let leagueFixtureJson = require("./leagueFixture.json")

//わかりやすく
const Members = memberJson.members
//botのdiscordユーザーID
const botID = "991590117036806234";

//メンバーリスト
const MemberList = []//固定
const SMemberList = []//サポメン
const gusetManagerList = memberJson.guestmanager

let keeperId = "";

for (let member of Members){
    //アクティブメンバー
    if(member.active) {
        MemberList.push(member.id)
        if(member.keeper) keeperId = member.id
    //サポートメンバー
    }else{
        SMemberList.push(member.id)
    }
}

//チャンネル
const myChannels = {
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
        && message.channelId == myChannels.ProClubVoteCh){
        message.react("⭕");
        message.react("❌");
        if(await isMatchDay())message.react("🚫")
        return;
    }
    
    if(message.content.includes("?tesuryobot matchday")){
        let Operation = message.content.split(" ")
        let day = Operation[2]
        let dsp = Operation[3]
        if(day.length !=1){
            return
        }

        let MsgCollection = await client.channels.cache.get(myChannels.WeekVoteCh).messages.fetch({limit:6});
        for (const m of MsgCollection.values()){
            if(m.embeds[0].title == day){
                const exampleEmbed = new EmbedBuilder()
                .setTitle(day)
                .setDescription(dsp)
                .setColor(m.embeds[0].color)
                m.edit({embeds:[exampleEmbed]})
                await m.react("🚫")
            }
        }
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
            res.end();
        });

    }else if (req.method == 'GET'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Discord Bot is active now\n');
    }

}).listen(3000);

//cron:プロクラブ出欠確認に投票投稿
cron.schedule(config.VoteTime,async ()=>{
    //今日がオフじゃないなら出欠確認を出す
    let embed;
    let matchday = await isMatchDay() 
    if(matchday){
        let title = "公式戦出欠"
        let description = matchday

        embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(0xff4500)
    }
    else if (!isOff()){
        let title = "練習出欠"
        let description = "⭕ : できる\n❌ : できない\n既に出欠がわかる日は<#1138445755619758150>へ\n20時までに不明な場合は<#1004623298107281409>に連絡"
        embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(0xff4500)
    }
    client.channels.cache.get(myChannels.ProClubVoteCh).send({embeds:[embed]});
});

//cron:プロクラブ出欠追跡メッセージ送信
cron.schedule(config.TrackerTime,async ()=>{
    //今日がオフじゃないなら
    if(!isOff()){
        SendTrackerText(myChannels.ProClubVoteCh, myChannels.ProClubVoteCh)
        console.log("sent TrackerMessage")
    }
});

//cron:プロクラブ出欠追跡テキスト更新
cron.schedule(config.UpdateTime,async ()=>{
    if(!isOff()) UpdateTrackerText(myChannels.ProClubVoteCh);
});

//cron:全員回答完了か判定
//全員回答完了したならばジャッジメッセージ送信
cron.schedule(config.confirmTime,async ()=>{

    let flag = await BooleanJudgeMessageExist(5); //全員回答したか
    let booleanMatchDay = await isMatchDay()

    //オフじゃない かつ　ジャッジメッセージがない かつ試合日でないなら
    if(!isOff() && !flag && !booleanMatchDay){
        //リアクションした人取得
        let userIdEachReactionList = await GetAllTodayVoteReaction()

        //各リアクションのメンバー
        let maru    = userIdEachReactionList[0]//⭕
        let batu    = userIdEachReactionList[1]//❌

        //答えた人、答えてない人
        let Ans = [...userIdEachReactionList[0], ...userIdEachReactionList[1]]
        let notAns = MemberList.filter(id => !Ans.includes(id))

        //判定用
        let keeperNum //キーパーの数
        let fieldNum = maru.length//フィールドの数
        let judgeNum //活動かfinか判定用の変数
        
        //キーパーが⭕のとき
        if(maru.includes(keeperId)){
            keeperNum = 1
            fieldNum -= 1
            judgeNum = fieldNum + notAns.length
        //キーパーが❌のとき
        }else if(batu.includes(keeperId)){
            keeperNum = 0
            judgeNum = fieldNum + notAns.length
        //キーパーが未回答のとき
        }else if(notAns.includes(keeperId)){
            keeperNum = -1
            judgeNum = fieldNum + notAns.length - 1
        }
        
        //ゲスト管理者
        let gm = GetGuestManager()
        let text =""

        if(judgeNum < config.minPlayer){//fin
            //全員回答済み
            if(notAns.length == 0){
                for (let id of maru) text += `<@${id}> `;
                text += "\n@⭕の人たち\n全員回答完了 "
            //未回答者アリ
            }else{
                for (let id of [...maru,...notAns]) text += `<@${id}> `;
                text += "\n@⭕と未回答の人たち\n全員回答完了してませんが"
            }
            text += `フィールド${config.minPlayer}人に満たないので今日はfin`
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

        }
        else if (notAns.length == 0){//全員回答完了の場合

            for (let id of maru)text += `<@${id}> `;
            text += "\n\n@⭕の人たち\n全員回答完了 "

            if(fieldNum >= 10){
                text += "フィールド10人集まりました!\n**22:30から活動!**\n"
            }else if(fieldNum < 10){ 
                text += `フィールド${fieldNum}人集まりました!\n**22:30から活動!**\n`
            }
            client.channels.cache.get(myChannels.ProClubVoteCh).send(text);

            //ゲス募内容送信
            if(10 > fieldNum | keeperNum == 0){
                const button = new ButtonBuilder()
                .setLabel('ゲス募する')
                .setURL(config.xurl)
                .setStyle(ButtonStyle.Link);
                const br = new ActionRowBuilder().addComponents(button)
            
                let text2 = "@週担当 "
                for (let id of gm) text2 += `<@${id}> `;
                text2 +=`\nゲス募よろしくお願いします!\n ゲス募:`
                if( fieldNum < 10) text2 += `**フィールド${10-fieldNum}人**`
                if( keeperNum == 0) text2+= " **GK**"
                client.channels.cache.get(myChannels.ProClubVoteCh).send({content:text2,components:[br]});
            }
        }
    }
});

//cron:回答リマインダー
cron.schedule(config.reminderTime,async () =>{
    //オフじゃないなら
    if(!isOff()){
        let flag = await BooleanJudgeMessageExist(5)
        if(!flag){
            let arr = await GetAllTodayVoteReaction()
            let all = []
            for(const erl of arr){
                all = all.concat(erl)
            }
            let set = new Set(all)
            let ans = Array.from(set)
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
    let booleanMatchDay = await isMatchDay()
    let flag = await BooleanJudgeMessageExist(5)
    //リーグ期間中で今日が土曜日 じゃないなら
    //オフじゃないなら
    if(!isOff() && !booleanMatchDay && !flag){
        //リアクションした人取得
        let userIdEachReactionList = await GetAllTodayVoteReaction()

        //各リアクションのメンバー
        let maru    = userIdEachReactionList[0]//⭕
        let batu    = userIdEachReactionList[1]//❌

        //答えた人、答えてない人
        let Ans = [...userIdEachReactionList[0], ...userIdEachReactionList[1]]
        let notAns = MemberList.filter(id => !Ans.includes(id))

        //判定用
        let keeperNum //キーパーの数
        let fieldNum = maru.length//フィールドの数
        let judgeNum //活動かfinか判定用の変数
        
        //キーパーが⭕のとき
        if(maru.includes(keeperId)){
            keeperNum = 1
            fieldNum -= 1
            judgeNum = fieldNum + notAns.length
        //キーパーが❌のとき
        }else if(batu.includes(keeperId)){
            keeperNum = 0
            judgeNum = fieldNum + notAns.length
        //キーパーが未回答のとき
        }else if(notAns.includes(keeperId)){
            keeperNum = -1
            judgeNum = fieldNum + notAns.length - 1
        }
        
        //ゲスト管理者
        let gm = GetGuestManager()
        let text =""
            
        //8人以上いる
        if(fieldNum >= config.minPlayer){
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

        //8人いない
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
    let MsgCollection = await client.channels.cache.get(myChannels.WeekVoteCh).messages.fetch({limit:5});

    const currentDate = new Date();
    // 1週間後の日付を計算
    const oneWeekLater = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const year = oneWeekLater.getFullYear()
    const month = oneWeekLater.getMonth()
    const date = oneWeekLater.getDate()

    for (const m of MsgCollection.values()){
        await m.reactions.removeAll();
        for (let emoji of ["⭕","❌"]) await m.react(emoji)

        try {
            let defaultEmbed = new EmbedBuilder()
            .setTitle(m.embeds[0].title)
            .setDescription(null)
            .setColor(m.embeds[0].color)
            m.edit({embeds:[defaultEmbed]})

            if(m.embeds[0].title =="金"){
                for(const md of leagueFixtureJson.match){
                    if(md.year == year && md.month == month + 1 && md.date == date){
                        let defaultEmbed = new EmbedBuilder()
                        .setTitle(m.embeds[0].title)
                        .setDescription(md.opponent)
                        .setColor(m.embeds[0].color)
                        m.edit({embeds:[defaultEmbed]})   
                        await m.react("🚫")
                        break
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
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

//試合日か判定
async function isMatchDay(targetDay = new Date().getDay()){
    let MsgCollection = await client.channels.cache.get(myChannels.WeekVoteCh).messages.fetch({limit:5});
    let days = ["日","月","火","水","木","金","土"]
    let nowday = targetDay
    for (const m of MsgCollection.values()){
        try {
            if(m.embeds[0].title == days[nowday]){
                if(m.embeds[0].description != null ){
                    return m.embeds[0].description
                }else{
                    return false
                }
            }
        } catch (error) {
            console.log(error)
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

//当日と週の合わせたリアクションを取得
//当日＞週
async function GetAllTodayVoteReaction(targetDay = new Date().getDay()){
    let TodayVoteReaction = [];
    //let WeekVoteReaction;
    
    await Promise.all([GetTodayVoteReaction(targetDay = targetDay),GetWeekVoteReaction(targetDay = targetDay)])
    .then(values =>{
        let numR = Math.min(values[0].length,values[1].length) 

        let todayall = []
        for (let i = 0 ; i < numR;i++){
            todayall = todayall.concat(values[0][i])
        }
        todayall = Array.from(new Set(todayall))

        for(let i = 0 ; i < numR;i++){
            let todayR = values[0][i]
            let weekR = values[1][i].filter(id => !todayall.includes(id))
            TodayVoteReaction.push(Array.from(new Set([...todayR,...weekR])))
        }
    })
    return TodayVoteReaction
}

//当日出欠のリアクション取得
async function GetTodayVoteReaction(
    targetDay = new Date().getDay(), 
    channel = myChannels.ProClubVoteCh)
    {

    let TodayVoteArray = []

    //メッセ取得
    let MsgCollection = await client.channels.cache.get(channel).messages.fetch({limit:30});

    for (const m of MsgCollection.values()) {
        //メッセージの条件
        //botかつ内容無しかつ今日送信されたメッセージ
        if(m.author.id == botID && m.content == "" && m.createdAt.getDay() == targetDay){

            //リアクションされている全ての絵文字
            const reactionEmojis = Array.from(m.reactions.cache.keys())
            let emojis = []
            for (const emoji of config.emojisForVoteReaction){
                if(reactionEmojis.includes(emoji))emojis.push(emoji)
            }

            //リアクションされている全ての絵文字それぞれのユーザーを取得
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
async function GetWeekVoteReaction(
    targetDay = new Date().getDay(),
    channel = myChannels.WeekVoteCh)
    {

    let weekVoteArray = []
    //埋め込みメッセージのタイトル
    let days = ["日","月","火","水","木","金","土"]
    let titleName = days[targetDay]

    //メッセージ取得
    let MsgCollection = await client.channels.cache.get(channel).messages.fetch({limit:5});

    for (const m of MsgCollection.values()) {
        //メッセージの条件
        //botかつ埋め込みタイトルが条件に一致
        if(m.author.id == botID && m.embeds[0].title == titleName){
            //リアクションされているすべての絵文字
            const reactionEmojis = Array.from(m.reactions.cache.keys())
            let emojis = []
            for (const emoji of config.emojisForVoteReaction){
                if(reactionEmojis.includes(emoji))emojis.push(emoji)
            }

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

//週の予定取得
async function GetSchedule(schedule){
    let nowday = new Date().getDay()
    let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

    for(let i = 0 ; i < 7 ; i++){
        if(!config.offDay.includes(i)){
            let voteReactionForEachReactionAtDayList;
            if(i <= nowday){
                voteReactionForEachReactionAtDayList = await GetAllTodayVoteReaction(targetDay = i)
            }else if(nowday<i){
                voteReactionForEachReactionAtDayList = await GetWeekVoteReaction(targetDay=i)
            }
            for (const id of voteReactionForEachReactionAtDayList[0]){
                try {
                    schedule[id][days[i]] = 1
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
    return schedule
}

//ポジション取得
async function getPosition(targetDay = new Date().getDay()){

    let nowday = new Date().getDay()
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

    for(let i = 0 ; i < 7 ; i++){
        let isMatch = await isMatchDay(i)
        if(!config.offDay.includes(i) && !isMatch){
            let reactionList;
            if(i <= nowday){
                reactionList = await GetAllTodayVoteReaction(targetDay = i)
            }else if(nowday < i){
                reactionList = await GetWeekVoteReaction(targetDay=i)
            }
            let maru = reactionList[0]
            for (const id of maru){
                try {
                    scheduleJson.schedule[id][days[i]] = 1
                } catch (error) {
                    console.log(error)
                }
            }
        }else{
            scheduleJson.days = scheduleJson.days.filter(d =>{ return d !=days[i] })
        }
    }

    let options = {
        uri: "http://tesuryo.pythonanywhere.com/",
        headers: {
          "Content-type": "application/json",
        },
        json: scheduleJson
    };
    
    request.post(options, function(error, response, body){
        let result = "今日のメンバー\nメンバーは確定・ポジは参考までに\n"
        if(config.offDay.includes(targetDay)){
            client.channels.cache.get("1118574751397466162").send("オフに動いてるよ");
        }else{
            for (const p of [...scheduleJson.positions,...["off"]]){
                for (const id of body[days[targetDay]][p]){
                    if(!id.includes("guest") | p != "off") result += `${p}:${memberJson.id2name[id]}\n`
                }
            }
            client.channels.cache.get(myChannels.ProClubVoteCh).send(result);
            console.log(result)
        }
    })
}

//　ゲスト管理者計算
function GetGuestManager(){
    let day1 = new Date("2024/02/05");
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
    let all = []
    for(const erl of userIdEachReactionList){
        all = all.concat(erl)
    }
    let set = new Set(all)
    let userIdAlreadyAnsweredList = Array.from(set)

    //答えてない人
    let userIdNotAnsweredList = MemberList.filter(id => !userIdAlreadyAnsweredList.includes(id)) //未回答の人（固定のみ）
    
    let maru  = userIdEachReactionList[0]
    let batu = userIdEachReactionList[1]

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
    for (let id of maru){
        for (let mem of Members){
            if(id == mem.id){
                text1 += mem.name+" "
                break
            }
        }
    }

    //途中参加
    if(userIdEachReactionList.length == 3){
        let delay = userIdEachReactionList[2]
        fieldNum += delay.length
        if (delay.includes(keeperId)){
            fieldNum -= 1
            GkNum = 1
        }

        for (let id of delay){
            for (let mem of Members){
                if(id == mem.id){
                    text1 += mem.name+"(遅れ) "
                    break
                }
            }
        }
    }
    
    //×の人
    for (let id of batu){
        for (let mem of Members){
            if(id == mem.id){
                text3 += mem.name+" "
                break
            }
        }
    }
    
    //未回答の人
    for (let id of userIdNotAnsweredList){
        for (let mem of Members){
            if(id == mem.id){
                text2 += mem.name+" "
                break
            }
        }
    }
    
    text += `:[${Hour}:${Min}:${Sec}時点の人数]\n**フィールド${fieldNum}人・GK${GkNum}人\n未回答${userIdNotAnsweredList.length}人**`
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
    let flag = false;
    //メッセコレクションの取得
    let MsgCollection = await GetTargetMessage(VoteCh, 10);
    //投票メッセを探す
    for (const m of MsgCollection.values()) {
        if(m.author.id == botID && m.content == "" && m.createdAt.getDay() == new Date().getDay()){
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

client.login(process.env.DISCORD_BOT_TOKEN);