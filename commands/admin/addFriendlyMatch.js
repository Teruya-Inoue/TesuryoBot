const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

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
              { name: "Never Say Never", value: "Never Say Never" },
              { name: "Ra VIRDY", value: "Ra VIRDY" },
              { name: "SEED JAPAN Plus", value: "SEED JAPAN Plus" },
              { name: "TEAM STRIKER", value: "TEAM STRIKER" },
              { name: "WELLDONE", value: "WELLDONE" }
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("goals")
            .setDescription("得点数")
            .setRequired(true)
            .setMinValue(0)
        )
        .addIntegerOption((option) =>
          option
            .setName("opponentsgoals")
            .setDescription("被弾数")
            .setRequired(true)
            .setMinValue(0)
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
            .setRequired(true)
            .setMinValue(0)
        )
        .addIntegerOption((option) =>
          option
            .setName("opponentsgoals")
            .setDescription("被弾数")
            .setRequired(true)
            .setMinValue(0)
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
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const name = interaction.options.getString("name");
    const goals = interaction.options.getInteger("goals");
    const opponentsgoals = interaction.options.getInteger("opponentsgoals");

    const year = interaction.options.getInteger("year");
    const month = interaction.options.getInteger("month");
    const day = interaction.options.getInteger("day");
    const h = interaction.options.getInteger("hour");
    const m = interaction.options.getInteger("minute");
    let unixTimestamp;
    if (
      year != null &&
      month != null &&
      day != null &&
      h != null &&
      m != null
    ) {
      const date = new Date(year, month - 1, day, h, m);

      // タイムゾーンオフセット（日本標準時はUTC+9時間）をミリ秒に変換します。
      const jstOffset = 9 * 60 * 60 * 1000;

      // UNIXタイムスタンプ（ミリ秒）からタイムゾーンオフセットを引いてUTCに変換します。
      const unixTimestampInMilliseconds = date.getTime();

      // UNIXタイムスタンプを秒単位で返します。
      unixTimestamp = Math.floor(unixTimestampInMilliseconds / 1000);
    } else {
      unixTimestamp = Math.floor(Date.now() / 1000);
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
      content: `${name} ${goals}-${opponentsgoals}`,
      ephemeral: true,
    });
  },
};
