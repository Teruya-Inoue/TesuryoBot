const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    // コマンドの名前
    .setName("clubplaylists")
    // コマンドの説明文
    .setDescription("クラブ配信のプレイリストのURLを表示します"),
  async execute(interaction) {
    const content =
      "全部:https://www.youtube.com/playlist?list=PLnJ5NkymnT04jtlp8W5LnTjeElu7pHbWk\nGK視点:https://www.youtube.com/playlist?list=PLnJ5NkymnT07k4HjHqqDmtGH9N0NENgln\n声有り:https://www.youtube.com/playlist?list=PLnJ5NkymnT07AScub7F8KMmGTmIpwSHYv\neS14th:https://www.youtube.com/playlist?list=PLnJ5NkymnT07dnDg3pCxyCdevRu07e_0X";
    await interaction.reply({ content: content, ephemeral: true });
  },
};
