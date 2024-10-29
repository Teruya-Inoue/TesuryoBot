const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

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

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("addfriendlymatch")
    // コマンドの説明文
    .setDescription("DBに試合情報を登録します(フレマ用)")
    //esチーム
    .addSubcommand((subcommand) =>
      subcommand
        .setName("es")
        .setDescription("eSチームとの試合")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("対戦チームの名前")
            .addChoices(
              { name: "Aplastar CF", value: "Aplastar CF" },
              { name: "Bana 11", value: "Bana 11" },
              { name: "Diverti", value: "Diverti" },
              { name: "FC Onions", value: "FC Onions" },
              { name: "Le Fort FC", value: "Le Fort FC" },
              { name: "MK BOMB", value: "MK BOMB" },
              { name: "HANNARI FC", value: "HANNARI FC" },
              { name: "Ra VIRDY", value: "Ra VIRDY" },
              { name: "SEED JAPAN", value: "SEED JAPAN" },
              { name: "Hookar", value: "Hookar" },
              { name: "WELLDONE", value: "WELLDONE" }
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("goals")
            .setDescription("得点数")
            .addChoices(
              { name: "0", value: 0 },
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 },
              { name: "6", value: 6 },
              { name: "7", value: 7 },
              { name: "8", value: 8 },
              { name: "9", value: 9 }
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("opponentsgoals")
            .setDescription("被弾数")
            .addChoices(
              { name: "0", value: 0 },
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 },
              { name: "6", value: 6 },
              { name: "7", value: 7 },
              { name: "8", value: 8 },
              { name: "9", value: 9 }
            )
        )
        .addIntegerOption((option)=>
          option
        .setName("m-ago")
        .setDescription("何分前に終わったか")
        )
        .addIntegerOption((option) =>
          option
            .setName("year")
            .setDescription("年")
            .addChoices(
              { name: "2024", value: 2024 },
              { name: "2025", value: 2025 }
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("month")
            .setDescription("月")
            .addChoices(
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 },
              { name: "6", value: 6 },
              { name: "7", value: 7 },
              { name: "8", value: 8 },
              { name: "9", value: 9 },
              { name: "10", value: 10 },
              { name: "11", value: 11 },
              { name: "12", value: 12 }
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("day")
            .setDescription("日")
            .setMinValue(1)
            .setMaxValue(31)
        )
        .addIntegerOption((option) =>
          option
            .setName("hour")
            .setDescription("時")
            .addChoices(
              { name: "22", value: 22 },
              { name: "23", value: 23 },
              { name: "0", value: 0 },
              { name: "1", value: 1 }
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("minute")
            .setDescription("分")
            .setMinValue(0)
            .setMaxValue(59)
        )
        .addStringOption((option) =>
          option
            .setName("endtype")
            .setDescription("試合の時間")
            .addChoices(
              { name: "前半", value: "前半" },
              { name: "後半", value: "後半" },
              { name: "延長", value: "延長" }
            )
        )
    )
    //esチーム
    .addSubcommand((subcommand) =>
      subcommand
        .setName("any")
        .setDescription("eSチーム以外との試合")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("対戦チームの名前")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("goals")
            .setDescription("得点数")
            .addChoices(
              { name: "0", value: 0 },
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 },
              { name: "6", value: 6 },
              { name: "7", value: 7 },
              { name: "8", value: 8 },
              { name: "9", value: 9 }
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("opponentsgoals")
            .setDescription("被弾数")
            .addChoices(
              { name: "0", value: 0 },
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 },
              { name: "6", value: 6 },
              { name: "7", value: 7 },
              { name: "8", value: 8 },
              { name: "9", value: 9 }
            )
        )
        .addIntegerOption((option)=>
          option
        .setName("m-ago")
        .setDescription("何分前に終わったか")
        )
        .addIntegerOption((option) =>
          option
            .setName("year")
            .setDescription("年")
            .addChoices(
              { name: "2024", value: 2024 },
              { name: "2025", value: 2025 }
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("month")
            .setDescription("月")
            .addChoices(
              { name: "1", value: 1 },
              { name: "2", value: 2 },
              { name: "3", value: 3 },
              { name: "4", value: 4 },
              { name: "5", value: 5 },
              { name: "6", value: 6 },
              { name: "7", value: 7 },
              { name: "8", value: 8 },
              { name: "9", value: 9 },
              { name: "10", value: 10 },
              { name: "11", value: 11 },
              { name: "12", value: 12 }
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("day")
            .setDescription("日")
            .setMinValue(1)
            .setMaxValue(31)
        )
        .addIntegerOption((option) =>
          option
            .setName("hour")
            .setDescription("時")
            .addChoices(
              { name: "22", value: 22 },
              { name: "23", value: 23 },
              { name: "0", value: 0 },
              { name: "1", value: 1 }
            )
        )
        .addIntegerOption((option) =>
          option
            .setName("minute")
            .setDescription("分")
            .setMinValue(0)
            .setMaxValue(59)
        )
        .addStringOption((option) =>
          option
            .setName("endtype")
            .setDescription("試合の時間")
            .addChoices(
              { name: "前半", value: "前半" },
              { name: "後半", value: "後半" },
              { name: "延長", value: "延長" }
            )
        )
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const name = interaction.options.getString("name");
    const endtype = interaction.options.getString("endtype");
    const goals = interaction.options.getInteger("goals");
    const opponentsgoals = interaction.options.getInteger("opponentsgoals");

    const mAgo = interaction.options.getInteger("m-ago")
    const year = interaction.options.getInteger("year");
    const month = interaction.options.getInteger("month");
    const day = interaction.options.getInteger("day");
    const h = interaction.options.getInteger("hour");
    const m = interaction.options.getInteger("minute");
    let unixTimestamp;

    if(mAgo!=null){
      // UNIXタイムスタンプを秒単位で返します。
      if (endtype == null || endtype == "後半") {
        unixTimestamp = Math.floor(Date.now() / 1000) - 1020 - mAgo*60;
      } else if (endtype == "前半") {
        unixTimestamp = Math.floor(Date.now() / 1000) - 510 - mAgo*60;
      } else if (endtype == "延長") {
        unixTimestamp = Math.floor(Date.now() / 1000) - 1500 - mAgo*60;
      }
    }
    else if (
      year != null &&
      month != null &&
      day != null &&
      h != null &&
      m != null
    ) {
      const date = new Date(year, month - 1, day, h, m);

      // UNIXタイムスタンプ（ミリ秒）からタイムゾーンオフセットを引いてUTCに変換します。
      const unixTimestampInMilliseconds = date.getTime();

      // UNIXタイムスタンプを秒単位で返します。
      if (endtype == null || endtype == "後半") {
        unixTimestamp = Math.floor(unixTimestampInMilliseconds / 1000) - 1020;
      } else if (endtype == "前半") {
        unixTimestamp = Math.floor(unixTimestampInMilliseconds / 1000) - 510;
      } else if (endtype == "延長") {
        unixTimestamp = Math.floor(unixTimestampInMilliseconds / 1000) - 1500;
      }
    } else {
      // UNIXタイムスタンプを秒単位で返します。
      if (endtype == null || endtype == "後半") {
        unixTimestamp = Math.floor(Date.now() / 1000) - 1020;
      } else if (endtype == "前半") {
        unixTimestamp = Math.floor(Date.now() / 1000) - 510;
      } else if (endtype == "延長") {
        unixTimestamp = Math.floor(Date.now() / 1000) - 1500;
      }
    }

    const filePath = "db/matchdata.csv";

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("ファイルの読み込み中にエラーが発生しました:", err);
        return;
      }
      const newData =
        data + `${name},${goals},${opponentsgoals},${unixTimestamp}\n`;
      // ファイルに書き込む
      fs.writeFile(filePath, newData, "utf8", (err) => {
        if (err) {
          console.error("ファイルの書き込み中にエラーが発生しました:", err);
          return;
        }

        console.log("ファイルの更新が完了しました。");
      });
    });

    await interaction.editReply({
      content: `${name} ${goals}-${opponentsgoals} ${jpdate(unixTimestamp)}`,
      ephemeral: true,
    });
  },
};
