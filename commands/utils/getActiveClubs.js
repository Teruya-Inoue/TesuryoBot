const { SlashCommandBuilder } = require("discord.js");

const clublist = [ 
    {name:"Aplastar CF" ,id:"4370"},
    {name:"Bana11" ,id:"4172"},
    {name:"Diverti" ,id:"765539"},
    {name:"FC Onions" ,id:"4592"},
    {name:"Le Fort FC" ,id:"4854"},
    {name:"MK BOMB" ,id:"33565"},
    {name:"Ra VIRDY" ,id:"314784"},
    {name:"WELLDONE" ,id:"4175"},
    {name:"HANNARI FC" ,id:"4479"},
    {name:"Hookar" ,id:"4166"}
  ]
  
function jpdate(timestamp){
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
    });
    return formattedDate
}

async function getClubData(nowTS,clubname,clubIds) {
    let players = []
    let formattedDate = "none"
  
    const leagueURL = `https://proclubs.ea.com/api/fc/clubs/matches?platform=common-gen5&clubIds=${clubIds}&matchType=leagueMatch&maxResultCount=1`
    const leagueFetch = fetch(leagueURL)
  
    const playoffURL = `https://proclubs.ea.com/api/fc/clubs/matches?platform=common-gen5&clubIds=${clubIds}&matchType=playoffMatch&maxResultCount=1`
    const playoffFetch = fetch(playoffURL)
  
    const [response1, response2] = await Promise.all([leagueFetch,playoffFetch])
    const leagueData = await response1.json()
    const playoffData = await response2.json()
  
    if(leagueData.length > 0 && playoffData.length > 0){
        const lt = leagueData[0]["timestamp"]
        const pt = playoffData[0]["timestamp"]
        if(lt > pt){
          if(nowTS-lt < 3600 *20){
            formattedDate = jpdate(lt)
            for (const playerid of Object.keys(leagueData[0]["players"][clubIds])){
                players.push(leagueData[0]["players"][clubIds][playerid]["playername"])
            }
            const text = `**${clubname}** ${formattedDate}\n` + "```\n" + players.join("\n") + "```\n"
            return text
          }
        }else if(pt > lt){
          if(nowTS-pt < 3600 *20){
            formattedDate = jpdate(pt)
            for (const playerid of Object.keys(playoffData[0]["players"][clubIds])){
                players.push(playoffData[0]["players"][clubIds][playerid]["playername"])
            }
            const text = `**${clubname}** ${formattedDate}\n` + "```\n" + players.join("\n") + "```\n"
            return text
          }
        }
    }else if(leagueData.length > 0){
        lt = leagueData[0]["timestamp"]
        if(nowTS-lt < 3600 *20){
          formattedDate = jpdate(lt)
          for (const playerid of Object.keys(leagueData[0]["players"][clubIds])){
            players.push(leagueData[0]["players"][clubIds][playerid]["playername"])
          }
          const text = `**${clubname}** ${formattedDate}\n` + "```\n" + players.join("\n") + "```\n"
          return text
        }
      }else if(playoffData.length > 0){
        pt = playoffData[0]["timestamp"]
        if(nowTS-pt < 3600 *20){
          formattedDate = jpdate(pt)
          for (const playerid of Object.keys(playoffData[0]["players"][clubIds])){
            players.push(playoffData[0]["players"][clubIds][playerid]["playername"])
          }
          const text = `**${clubname}** ${formattedDate}\n` + "```\n" + players.join("\n") + "```\n"
        return text
      }
    }
  }


module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("getactiveclubs")
    // コマンドの説明文
    .setDescription("今日活動してるクラブとそのメンバーを取得します"),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const nowTS = Math.floor(Date.now() / 1000);
    let text_list = ["活動してるクラブ\n"]
    for (const club of clublist) {
      const clubname = club["name"]
      const clubIds = club["id"]
      text_list.push(getClubData(nowTS,clubname,clubIds))
    }
    const comptext = await Promise.all(text_list)

    await interaction.editReply({
        content: comptext.join(""),
        ephemeral: true,});
    
  },
};
