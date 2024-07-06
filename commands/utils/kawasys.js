const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("kawasys")
    // コマンドの説明文
    .setDescription("For Founder")
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
        )
        .setRequired(true)
    )
    //rf
    .addStringOption((option) =>
      option
        .setName("rf")
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
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
          { name: "誰でも", value: "誰でも" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("yobo")
        .setDescription(
          "要望欄。試したい配置とかあれば。ない場合は書かなくてOK"
        )
    ),
  async execute(interaction) {
    // Pong!と返信
    await interaction.deferReply({ ephemeral: true });

    const roles = interaction.member.roles.cache;
    const hasFounderRole = roles.some((role) => role.name === "founder");

    // "founder" ロールを持っていない場合は処理を中断
    if (!hasFounderRole) {
      await interaction.editReply({
        content: "このコマンドを使用するにはfounder ロールが必要です。",
        ephemeral: true,
      });
      return;
    }

    const userId = interaction.user.id;
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
    const yobo = interaction.options.getString("yobo");

    data = `${userId},${st},${lf},${rf},${lcm},${cm},${rcm},${lb},${lcb},${rcb},${rb},${gk},${yobo}\n`;

    const filePath = "db/kawasys.csv";

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("ファイルの読み込み中にエラーが発生しました:", err);
        return;
      }
      const newData =
        data +
        `${userId},${st},${lf},${rf},${lcm},${cm},${rcm},${lb},${lcb},${rcb},${rb},${gk}\n`;
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
      content: `あなたの投票内容\nST:${st}\nLF:${lf}\nRF:${rf}\nLCM:${lcm}\nCM:${cm}\nRCM:${rcm}\nLB:${lb}\nLCB:${lcb}\nRCB:${rcb}\nRB:${rb}\nGK:${gk}\n要望:${yobo}\n`,
      ephemeral: true,
    });
  },
};
