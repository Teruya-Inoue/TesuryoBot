const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("clubplaylists")
    // コマンドの説明文
    .setDescription("クラブ配信のプレイリストのURLを表示します"),
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
    const content =
      "全部:https://www.youtube.com/playlist?list=PLnJ5NkymnT04jtlp8W5LnTjeElu7pHbWk\nGK視点:https://www.youtube.com/playlist?list=PLnJ5NkymnT07k4HjHqqDmtGH9N0NENgln\n声有り:https://www.youtube.com/playlist?list=PLnJ5NkymnT07AScub7F8KMmGTmIpwSHYv\neS14th:https://www.youtube.com/playlist?list=PLnJ5NkymnT07dnDg3pCxyCdevRu07e_0X";
    await interaction.editReply({ content: content, ephemeral: true });
  },
};
