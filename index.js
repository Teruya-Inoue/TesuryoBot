// Require
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Events,
  Partials,
  Collection,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { EAFCApiService } = require("eafc-clubs-api");

const cron = require("node-cron");
const config = require("./config.json");
const memberJson = require("./db/member.json");

//わかりやすく
const Members = memberJson.members;

//メンバーリスト
const MemberIdList = []; //アクティブメンバーID
const SMemberIdList = []; //サポメンID
const MemberNameList = []; //アクティブメンバーの名前
const SMemberNameList = []; //サポメンの名前

for (let member of Members) {
  //アクティブメンバー
  if (member.active) {
    MemberIdList.push(member.id);
    MemberNameList.push(member.name);
    if (member.keeper) keeperId = member.id;
    //サポートメンバー
  } else {
    SMemberIdList.push(member.id);
    SMemberNameList.push(member.name);
  }
}

//チャンネル
const myChannels = {
  ProClubVoteCh: "972816498215227402", //プロクラブ出欠確認
  WeekVoteCh: "1138445755619758150",
};

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

for (let pathname of ["commands/utils", "commands/admin"]) {
  const commandsPath = path.join(__dirname, pathname);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// When the client is ready, run this code (only once)
client.once("ready", async () => {
  console.log("Botの準備が完了しました");
  console.log(await client.channels.cache.get(myChannels.WeekVoteCh).messages.fetch({limit:10}));
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});


cron.schedule(config.GetMatchInfoTime, async () => {
  const apiService = new EAFCApiService();
  const leagueMatch = await apiService.matchesStats({
    clubIds: "136886",
    platform: "common-gen5",
    matchType: "leagueMatch",
  });
  const playoffMatch = await apiService.matchesStats({
    clubIds: "136886",
    platform: "common-gen5",
    matchType: "playoffMatch",
  });
  const matches = [...leagueMatch, ...playoffMatch];
  fs.writeFileSync("db/match.json", JSON.stringify(matches));
  console.log("書き込み完了");
  // Pythonスクリプトのパス
  const pythonScriptPath = "py/save_matchdata.py";

  // Pythonプロセスを生成
  const pythonProcess = spawn("python", [pythonScriptPath]);

  // 標準エラー出力のデータを受信するイベントハンドラ
  pythonProcess.stderr.on("data", (data) => {
    console.error(`save_matchdata.pyからのエラー出力: ${data}`);
  });

  // Pythonプロセスの終了を待機
  pythonProcess.on("close", (code) => {
    console.log(`save_matchdata.pyが終了しました。終了コード: ${code}`);
  });
});

cron.schedule("30 0 * * 2-6",async () =>{
  let log = ["今日の動画"];
    const pythonScriptPath = "py/update.py";

    // Pythonプロセスを生成
    const pythonProcess = spawn("python", [pythonScriptPath]);

    // 標準出力を受け取る
    pythonProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      log.push(data);
    });

    // 標準エラー出力のデータを受信するイベントハンドラ
    pythonProcess.stderr.on("data", (data) => {
      console.error(`update.pyからのエラー出力: ${data}`);
    });

    // Pythonプロセスの終了を待機
    pythonProcess.on("close", async (code) => {
      console.log(`update.pyが終了しました。終了コード`);
    });
})

cron.schedule("0 23 * * 1-5",async () =>{
  let log = ["今日の動画"];
  const pythonScriptPath = "py/addPlaylist.py";

    // Pythonプロセスを生成
    const pythonProcess = spawn("python", [pythonScriptPath]);

    // 標準出力を受け取る
    pythonProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      log.push(data);
    });

    // 標準エラー出力のデータを受信するイベントハンドラ
    pythonProcess.stderr.on("data", (data) => {
      console.error(`addPlaylist.pyからのエラー出力: ${data}`);
    });

    // Pythonプロセスの終了を待機
    pythonProcess.on("close", async (code) => {
      console.log(`addPlaylist.pyが正常終了`);
    });
})


async function fetchMany(channel, options = { limit: 50 }) {
  if ((options.limit ?? 50) <= 100) {
    return channel.messages.fetch(options);
  }

  if (typeof options.around === "string") {
    const messages = await channel.messages.fetch({ ...options, limit: 100 });
    const limit = Math.floor((options.limit - 100) / 2);
    if (messages.size < 100) {
      return messages;
    }
    const backward = fetchMany(channel, { limit, before: messages.last().id });
    const forward = fetchMany(channel, { limit, after: messages.first().id });
    return array2Collection(
      [messages, ...(await Promise.all([backward, forward]))].flatMap((e) => [
        ...e.values(),
      ])
    );
  }
  let temp;
  function buildParameter() {
    const req_cnt = Math.min(options.limit - messages.length, 100);
    if (typeof options.after === "string") {
      const after = temp ? temp.first().id : options.after;
      return { ...options, limit: req_cnt, after };
    }
    const before = temp ? temp.last().id : options.before;
    return { ...options, limit: req_cnt, before };
  }
  const messages = [];
  while (messages.length < options.limit) {
    const param = buildParameter();
    temp = await channel.messages.fetch(param);
    messages.push(...temp.values());
    if (param.limit > temp.size) {
      break;
    }
  }
  return array2Collection(messages);
}

function array2Collection(messages) {
  return new Collection(
    messages
      .slice()
      .sort((a, b) => {
        const a_id = BigInt(a.id);
        const b_id = BigInt(b.id);
        return a_id > b_id ? 1 : a_id === b_id ? 0 : -1;
      })
      .map((e) => [e.id, e])
  );
}

//return String(CSV Format)
async function getAttendanceRecord(y_b = 1999, m_b = 1, d_b = 1) {
  const date_before = new Date(y_b, m_b - 1, d_b);
  const fetchedMessages = await fetchMany(
    client.channels.cache.get(myChannels.ProClubVoteCh),
    { limit: 800 }
  );
  const header = ["year", "month", "day", "day of the week"]
    .concat(MemberNameList)
    .join(",");
  const data = [];
  fetchedMessages.forEach((msg) => {
    if (msg.content.match("Tracker") && msg.createdAt >= date_before) {
      let year = msg.createdAt.getFullYear();
      let month = msg.createdAt.getMonth() + 1;
      let date = msg.createdAt.getDate();
      let day = msg.createdAt.getDay();

      let Attendees = msg.content
        .replace(/\(.*?\)/g, "")
        .split("\n")
        .pop()
        .split("```")[1]
        .split(":")
        .pop()
        .split(" ");

      const attendData = [];
      attendData.push(year);
      attendData.push(month);
      attendData.push(date);
      attendData.push(day);

      for (const name of MemberNameList) {
        const attend = +Attendees.includes(name);
        attendData.push(attend);
      }
      data.push(attendData.join(","));
    }
  });
  return `${header}\n${data.join("\n")}`;
}

client.login(process.env.DISCORD_BOT_TOKEN);
