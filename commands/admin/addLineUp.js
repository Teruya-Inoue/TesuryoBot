const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("lineup")
    // コマンドの説明文
    .setDescription("DBに今日のメンバーを登録します")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("4321")
        .setDescription("フォメ4321")
        //lf
        .addStringOption((option) =>
          option
            .setName("lf")
            .setDescription("LFのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //st
        .addStringOption((option) =>
          option
            .setName("st")
            .setDescription("STのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )

        //rf
        .addStringOption((option) =>
          option
            .setName("rf")
            .setDescription("RFのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //rf
        .addStringOption((option) =>
          option
            .setName("lcm")
            .setDescription("LCMのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //cm
        .addStringOption((option) =>
          option
            .setName("cm")
            .setDescription("CMのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //rcm
        .addStringOption((option) =>
          option
            .setName("rcm")
            .setDescription("RCMのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //lb
        .addStringOption((option) =>
          option
            .setName("lb")
            .setDescription("LBのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //lcb
        .addStringOption((option) =>
          option
            .setName("lcb")
            .setDescription("LCBのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //rcb
        .addStringOption((option) =>
          option
            .setName("rcb")
            .setDescription("RCBのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //rb
        .addStringOption((option) =>
          option
            .setName("rb")
            .setDescription("RBのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
        //gk
        .addStringOption((option) =>
          option
            .setName("gk")
            .setDescription("GKのメンバー")
            .addChoices(
              { name: "りんりん", value: "りんりん" },
              { name: "たかおみ", value: "たかおみ" },
              { name: "ぽりょり", value: "ぽりょり" },
              { name: "ぐり", value: "ぐり" },
              { name: "だひょん", value: "だひょん" },
              { name: "たいが", value: "たいが" },
              { name: "しーあーる", value: "しーあーる" },
              { name: "ヤヤ", value: "ヤヤ" },
              { name: "あゆれ", value: "あゆれ" },
              { name: "くわがた", value: "くわがた" },
              { name: "にし", value: "にし" },
              { name: "べや", value: "べや" },
              { name: "ソノ", value: "ソノ" },
              { name: "ゲスト", value: "ゲスト" },
              { name: "サポメン", value: "サポメン" },
              { name: "COM", value: "COM" }
            )
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.reply({ ephemeral: true });

    if (subcommand === "4321") {
      const st = interaction.options.getString("st");
      const lf = interaction.options.getString("lf");
      const rf = interaction.options.getString("rf");
      const lcm = interaction.options.getString("lcm");
      const cm = interaction.options.getString("cm");
      const rcm = interaction.options.getString("rcm");
      const lb = interaction.options.getString("lb");
      const lcb = interaction.options.getString("lcb");
      const rcb = interaction.options.getString("rcb");
      const rb = interaction.options.getString("rb");
      const gk = interaction.options.getString("gk");
      const filePath = "db/4321.json";

      fs.readFile(filePath, "utf8", async (err, data) => {
        if (err) {
          console.error("Error reading the file:", err);
          return;
        }

        let jsonData = JSON.parse(data);

        // JSONデータを更新
        if (lf != null) jsonData.LF = lf;
        if (st != null) jsonData.ST = st;
        if (rf != null) jsonData.RF = rf;
        if (lcm != null) jsonData.LCM = lcm;
        if (cm != null) jsonData.CM = cm;
        if (rcm != null) jsonData.RCM = rcm;
        if (lb != null) jsonData.LB = lb;
        if (lcb != null) jsonData.LCB = lcb;
        if (rcb != null) jsonData.RCB = rcb;
        if (rb != null) jsonData.RB = rb;
        if (gk != null) jsonData.GK = gk;

        // 更新されたJSONデータをファイルに書き込む
        fs.writeFile(
          filePath,
          JSON.stringify(jsonData, null, 2),
          "utf8",
          (err) => {
            if (err) {
              console.error("Error writing the file:", err);
              return;
            }

            console.log("JSON data has been updated and written to the file.");
          }
        );
        await interaction.editReply({
          content: "",
          ephemeral: true,
        });
      });
    }
  },
};
