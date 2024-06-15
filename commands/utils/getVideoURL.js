const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("clubvideo")
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
        .setName("ephmeral")
        .setDescription("Default:True;Trueなら自分だけ,Falseならみんなに表示")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const roles = interaction.member.roles.cache;
    const hasRole = roles.some((role) => role.name === "member");
    if (!hasRole) {
      await interaction.editReply({
        content: "このコマンドを使用するにはmemberロールが必要です。",
        ephemeral: true,
      });
      return;
    }
    const content = "作成中";
    await interaction.editReply({ content: content, ephemeral: true });
  },
};
