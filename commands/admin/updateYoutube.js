const { SlashCommandBuilder } = require("discord.js");
const { spawn } = require("child_process");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("updateyoutube")
    // コマンドの説明文
    .setDescription("今日のクラブ配信のサムネ・概要欄を更新します"),
  async execute(interaction) {
    await interaction.deferReply();
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
      await interaction.editReply({
        content: log.join("\n"),
        ephemeral: false,
      });
    });
  },
};
