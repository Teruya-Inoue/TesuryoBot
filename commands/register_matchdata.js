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
    .addIntegerOption((option) => option.setName("year").setDescription("年"))
    .addIntegerOption((option) =>
      option
        .setName("month")
        .setDescription("月")
        .setMinValue(1)
        .setMaxValue(12)
    )
    .addIntegerOption((option) =>
      option.setName("day").setDescription("日").setMinValue(1).setMaxValue(31)
    )
    .addIntegerOption((option) =>
      option.setName("hour").setDescription("時").setMinValue(0).setMaxValue(23)
    )
    .addIntegerOption((option) =>
      option
        .setName("minute")
        .setDescription("分")
        .setMinValue(0)
        .setMaxValue(59)
    ),

  async execute(interaction) {
    // Pong!と返信
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
      const unixTimestampInMilliseconds = date.getTime() - jstOffset;

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
