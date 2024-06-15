const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("add4321")
    // コマンドの説明文
    .setDescription("DBに今日の4321メンバーを登録します")
    //st
    .addStringOption((option) =>
      option
        .setName("st")
        .setDescription("STのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //lf
    .addStringOption((option) =>
      option
        .setName("lf")
        .setDescription("LFのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //rf
    .addStringOption((option) =>
      option
        .setName("rf")
        .setDescription("RFのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //rf
    .addStringOption((option) =>
      option
        .setName("lcm")
        .setDescription("LCMのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //cm
    .addStringOption((option) =>
      option
        .setName("cm")
        .setDescription("CMのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //rcm
    .addStringOption((option) =>
      option
        .setName("rcm")
        .setDescription("RCMのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //lb
    .addStringOption((option) =>
      option
        .setName("lb")
        .setDescription("LBのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //lcb
    .addStringOption((option) =>
      option
        .setName("lcb")
        .setDescription("LCBのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //rcb
    .addStringOption((option) =>
      option
        .setName("rcb")
        .setDescription("RCBのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //rb
    .addStringOption((option) =>
      option
        .setName("rb")
        .setDescription("RBのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    )
    //gk
    .addStringOption((option) =>
      option
        .setName("gk")
        .setDescription("GKのメンバー")
        .addChoices(
          { name: "あゆれ", value: "あゆれ" },
          { name: "くわがた", value: "くわがた" },
          { name: "ぐり", value: "ぐり" },
          { name: "しーあーる", value: "しーあーる" },
          { name: "ソノ", value: "ソノ" },
          { name: "たいが", value: "たいが" },
          { name: "たかおみ", value: "たかおみ" },
          { name: "だひょん", value: "だひょん" },
          { name: "トクソ", value: "トクソ" },
          { name: "にし", value: "にし" },
          { name: "べや", value: "べや" },
          { name: "ぽりょり", value: "ぽりょり" },
          { name: "りんりん", value: "りんりん" },
          { name: "ヤヤ", value: "ヤヤ" },
          { name: "ゲスト", value: "ゲスト" },
          { name: "COM", value: "COM" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    // Pong!と返信
    await interaction.deferReply({ ephemeral: true });

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

    const data = {
      ST: st,
      LF: lf,
      RF: rf,
      LCM: lcm,
      CM: cm,
      RCM: rcm,
      LB: lb,
      LCB: lcb,
      RCB: rcb,
      RB: rb,
      GK: gk,
    };

    // JSON形式に変換
    const jsonData = JSON.stringify(data, null, 2);

    // ファイルに保存
    fs.writeFile("db/4321.json", jsonData, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File has been saved.");
      }
    });

    await interaction.editReply({
      content: "書き込み完了",
      ephemeral: true,
    });
  },
};
