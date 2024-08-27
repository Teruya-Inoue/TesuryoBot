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
            .setRequired(true)
        )
        //st
        .addStringOption((option) =>
          option
            .setName("st")
            .setDescription("STのメンバー")
            .setRequired(true)
        )

        //rf
        .addStringOption((option) =>
          option
            .setName("rf")
            .setDescription("RFのメンバー")
            .setRequired(true)
        )
        //rf
        .addStringOption((option) =>
          option
            .setName("lcm")
            .setDescription("LCMのメンバー")
            .setRequired(true)
        )
        //cm
        .addStringOption((option) =>
          option
            .setName("cm")
            .setDescription("CMのメンバー")
            .setRequired(true)
        )
        //rcm
        .addStringOption((option) =>
          option
            .setName("rcm")
            .setDescription("RCMのメンバー")
            .setRequired(true)
        )
        //lb
        .addStringOption((option) =>
          option
            .setName("lb")
            .setDescription("LBのメンバー")
            .setRequired(true)
        )
        //lcb
        .addStringOption((option) =>
          option
            .setName("lcb")
            .setDescription("LCBのメンバー")
            .setRequired(true)
        )
        //rcb
        .addStringOption((option) =>
          option
            .setName("rcb")
            .setDescription("RCBのメンバー")
            .setRequired(true)
        )
        //rb
        .addStringOption((option) =>
          option
            .setName("rb")
            .setDescription("RBのメンバー")
            .setRequired(true)
        )
        //gk
        .addStringOption((option) =>
          option
            .setName("gk")
            .setDescription("GKのメンバー")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply({ ephemeral: true });

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
          content: JSON.stringify(jsonData, null, 2),
          ephemeral: true,
        });
      });
    }
  },
};
