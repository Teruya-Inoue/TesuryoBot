const { SlashCommandBuilder } = require("discord.js");
const { spawn } = require("child_process");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("getvideo")
    // コマンドの説明文
    .setDescription("クラブ配信のURLを表示します")
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
        .setMinValue(1)
        .setMaxValue(12)
    )
    .addIntegerOption((option) =>
      option.setName("day").setDescription("日").setMinValue(1).setMaxValue(31)
    )
    .addBooleanOption((option) =>
      option
        .setName("invisible")
        .setDescription("Default:True;Trueなら自分だけ,Falseならみんなに表示")
    ),

  async execute(interaction) {
    //遅延処理
    await interaction.deferReply({ ephemeral: true });
    const pythonScriptPath = "py/getVideo.py";
    //メンバー以外には実行させない
    const roles = interaction.member.roles.cache;
    const hasRole = roles.some(
      (role) => role.name === "member" || role.name === "サポメン"
    );
    if (!hasRole) {
      await interaction.editReply({
        content: "このコマンドを使用するにはmemberロールが必要です。",
        ephemeral: true,
      });
      return;
    }

    // 見えるか見えないか
    let ephemeralBool = interaction.options.getBoolean("invisible");
    if (ephemeralBool == null) {
      ephemeralBool = true;
    }

    const year = interaction.options.getInteger("year");
    const month = interaction.options.getInteger("month");
    const day = interaction.options.getInteger("day");

    //日付が指定されている場合
    if (year != null || month != null || day != null) {
      if (year != null && month != null && day != null) {
        //取得
        const specifiedDate = new Date(
          Date.UTC(year, month - 1, day, 15, 30, 0)
        );

        //日付が不正だったとき
        if (isNaN(specifiedDate.getTime())) {
          await interaction.editReply({
            content: "指定した日付が不正です",
            ephemeral: true,
          });
          return;
        }

        const unixTimestamp = Math.floor(specifiedDate.getTime() / 1000);
        let log = [`${year}年${month}月${day}日の動画`];
        // Pythonプロセスを生成
        const pythonProcess = spawn("python", [
          pythonScriptPath,
          unixTimestamp,
        ]);

        // 標準出力を受け取る
        pythonProcess.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
          log.push(data);
        });

        // 標準エラー出力のデータを受信するイベントハンドラ
        pythonProcess.stderr.on("data", (data) => {
          console.error(`getTodayVideo.pyからのエラー出力: ${data}`);
        });

        // Pythonプロセスの終了を待機
        pythonProcess.on("close", async (code) => {
          console.log(`getTodayVideo.pyが正常終了`);
          await interaction.editReply({
            content: log.join("\n"),
            ephemeral: ephemeralBool,
          });
        });

        // すべて指定されてないとき
      } else {
        await interaction.editReply({
          content: "日付を指定するなら年・月・日すべてを指定してください",
          ephemeral: true,
        });
        return;
      }
    } else {
      let log = [`今日の動画`];
      // Pythonプロセスを生成
      const pythonProcess = spawn("python", [pythonScriptPath]);

      // 標準出力を受け取る
      pythonProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
        log.push(data);
      });

      // 標準エラー出力のデータを受信するイベントハンドラ
      pythonProcess.stderr.on("data", (data) => {
        console.error(`getTodayVideo.pyからのエラー出力: ${data}`);
      });

      // Pythonプロセスの終了を待機
      pythonProcess.on("close", async (code) => {
        console.log(`getTodayVideo.pyが正常終了`);
        await interaction.editReply({
          content: log.join("\n"),
          ephemeral: ephemeralBool,
        });
      });
    }
  },
};
