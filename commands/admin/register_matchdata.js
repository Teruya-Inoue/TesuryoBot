const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("addmatchdata")
    // コマンドの説明文
    .setDescription("DBに試合情報を登録します(フレマ用)")
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
          { name: 1, value: 1 },
          { name: 2, value: 2 },
          { name: 3, value: 3 },
          { name: 4, value: 4 },
          { name: 5, value: 5 },
          { name: 6, value: 6 },
          { name: 7, value: 7 },
          { name: 8, value: 8 },
          { name: 9, value: 9 },
          { name: 10, value: 10 },
          { name: 11, value: 11 },
          { name: 12, value: 12 }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("day")
        .setDescription("日")
        .addChoices(
          { name: 1, value: 1 },
          { name: 2, value: 2 },
          { name: 3, value: 3 },
          { name: 4, value: 4 },
          { name: 5, value: 5 },
          { name: 6, value: 6 },
          { name: 7, value: 7 },
          { name: 8, value: 8 },
          { name: 9, value: 9 },
          { name: 10, value: 10 },
          { name: 11, value: 11 },
          { name: 12, value: 12 },
          { name: 13, value: 13 },
          { name: 14, value: 14 },
          { name: 15, value: 15 },
          { name: 16, value: 16 },
          { name: 17, value: 17 },
          { name: 18, value: 18 },
          { name: 19, value: 19 },
          { name: 20, value: 20 },
          { name: 21, value: 21 },
          { name: 22, value: 22 },
          { name: 23, value: 23 },
          { name: 24, value: 24 },
          { name: 25, value: 25 },
          { name: 26, value: 26 },
          { name: 27, value: 27 },
          { name: 28, value: 28 },
          { name: 29, value: 29 },
          { name: 30, value: 30 },
          { name: 31, value: 31 }
        )
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
        .addChoices(
          { name: 0, value: 0 },
          { name: 1, value: 1 },
          { name: 2, value: 2 },
          { name: 3, value: 3 },
          { name: 4, value: 4 },
          { name: 5, value: 5 },
          { name: 6, value: 6 },
          { name: 7, value: 7 },
          { name: 8, value: 8 },
          { name: 9, value: 9 },
          { name: 10, value: 10 },
          { name: 11, value: 11 },
          { name: 12, value: 12 },
          { name: 13, value: 13 },
          { name: 14, value: 14 },
          { name: 15, value: 15 },
          { name: 16, value: 16 },
          { name: 17, value: 17 },
          { name: 18, value: 18 },
          { name: 19, value: 19 },
          { name: 20, value: 20 },
          { name: 21, value: 21 },
          { name: 22, value: 22 },
          { name: 23, value: 23 },
          { name: 24, value: 24 },
          { name: 25, value: 25 },
          { name: 26, value: 26 },
          { name: 27, value: 27 },
          { name: 28, value: 28 },
          { name: 29, value: 29 },
          { name: 30, value: 30 },
          { name: 31, value: 31 },
          { name: 32, value: 32 },
          { name: 33, value: 33 },
          { name: 34, value: 34 },
          { name: 35, value: 35 },
          { name: 36, value: 36 },
          { name: 37, value: 37 },
          { name: 38, value: 38 },
          { name: 39, value: 39 },
          { name: 40, value: 40 },
          { name: 41, value: 41 },
          { name: 42, value: 42 },
          { name: 43, value: 43 },
          { name: 44, value: 44 },
          { name: 45, value: 45 },
          { name: 46, value: 46 },
          { name: 47, value: 47 },
          { name: 48, value: 48 },
          { name: 49, value: 49 },
          { name: 50, value: 50 },
          { name: 51, value: 51 },
          { name: 52, value: 52 },
          { name: 53, value: 53 },
          { name: 54, value: 54 },
          { name: 55, value: 55 },
          { name: 56, value: 56 },
          { name: 57, value: 57 },
          { name: 58, value: 58 },
          { name: 59, value: 59 }
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
