const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("addmatchdata")
    // コマンドの説明文
    .setDescription("DBに試合情報を登録します")
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
    ),

  async execute(interaction) {
    // Pong!と返信
    await interaction.deferReply({ ephemeral: true });
    const name = interaction.options.getString("name");
    const goals = interaction.options.getInteger("goals");
    const opponentsgoals = interaction.options.getInteger("opponentsgoals");
    const unixTimestamp = Math.floor(Date.now() / 1000);
    const filePath = "db/matchdata.csv";

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("ファイルの読み込み中にエラーが発生しました:", err);
        return;
      }
      const newData =
        data + `${name},${goals},${opponentsgoals},${unixTimestamp}`;
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
